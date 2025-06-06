import express from "express";
import sqlite3 from "sqlite3";
import path from "path";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// SQLite DB setup inside server folder
const dbPath = path.join(__dirname, "flashsavvy.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database error:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    stock INTEGER NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  )`);
});

// Routes
app.get("/products", (req, res) => {
  db.all(`SELECT * FROM products`, [], (err, rows) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, data: rows });
  });
});

app.post("/orders", (req, res) => {
  const { user_id, items } = req.body;
  if (!user_id || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Invalid order data" });
  }

  db.serialize(() => {
    let total = 0;

    const getPrice = (id, quantity, cb) => {
      db.get(`SELECT price FROM products WHERE id = ?`, [id], (err, row) => {
        if (err || !row) return cb(null, 0);
        cb(null, row.price * quantity);
      });
    };

    let pricesFetched = 0;
    items.forEach((item) => {
      getPrice(item.product_id, item.quantity, (err, cost) => {
        total += cost;
        pricesFetched++;
        if (pricesFetched === items.length) {
          db.run(
            `INSERT INTO orders (user_id, total) VALUES (?, ?)`,
            [user_id, total],
            function (err) {
              if (err) return res.status(500).json({ error: err.message });

              const orderId = this.lastID;
              const stmt = db.prepare(
                `INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)`
              );
              items.forEach((item) => {
                stmt.run(orderId, item.product_id, item.quantity);
              });
              stmt.finalize(() => {
                res.json({ message: "Order created", order_id: orderId });
              });
            }
          );
        }
      });
    });
  });
});

app.post("/seed", (req, res) => {
  const products = [
    ["T-Shirt", "100% cotton, unisex", 19.99, 100],
    ["Hoodie", "Warm and comfy", 39.99, 50],
    ["Sneakers", "Lightweight running shoes", 59.99, 75],
  ];

  try {
    const stmt = db.prepare(
      `INSERT INTO products (name, description, price, stock) VALUES (?, ?, ?, ?)`
    );
    products.forEach((p) => stmt.run(p));
    stmt.finalize((err) => {
      if (err) {
        console.error("Error seeding products:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, message: "Products seeded successfully" });
    });
  } catch (err) {
    console.error("Error preparing statement:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`FlashSavvy backend running at http://localhost:${PORT}`);
});
// Register route
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
    [name, email, hashedPassword],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE")) {
          return res.status(400).json({ error: "Email already in use" });
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "User registered", user_id: this.lastID });
    }
  );
});

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "Login successful", user_id: user.id });
  });
});
