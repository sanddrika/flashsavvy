import { getDb } from "../utils/db.js";
import { corsMiddleware } from "../utils/middleware.js";

export default async function handler(req, res) {
  // Handle CORS
  if (corsMiddleware(req, res)) return;

  const db = getDb();

  if (req.method === 'GET') {
    db.all(`SELECT * FROM products`, [], (err, rows) => {
      if (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, data: rows });
    });
  } 
  else if (req.method === 'POST') {
    const { name, description, price, stock, image_url } = req.body;
    
    if (!name || !price || !stock) {
      return res.status(400).json({ error: "Name, price, and stock are required" });
    }

    db.run(
      `INSERT INTO products (name, description, price, stock, image_url) VALUES (?, ?, ?, ?, ?)`,
      [name, description, price, stock, image_url],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ 
          success: true, 
          message: "Product added successfully",
          productId: this.lastID 
        });
      }
    );
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 