import bcrypt from "bcrypt";
import { getDb } from "../utils/db.js";
import { corsMiddleware } from "../utils/middleware.js";

export default async function handler(req, res) {
  // Handle CORS
  if (corsMiddleware(req, res)) return;

  const db = getDb();

  if (req.method === 'POST') {
    const { action } = req.query;

    if (action === 'register') {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
      }

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
    }
    else if (action === 'login') {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
      }

      db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: "Invalid credentials" });

        res.json({ 
          message: "Login successful", 
          user_id: user.id,
          is_admin: Boolean(user.is_admin)
        });
      });
    }
    else {
      res.status(400).json({ error: "Invalid action" });
    }
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 