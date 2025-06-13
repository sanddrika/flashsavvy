import { getDb } from "../utils/db.js";
import { corsMiddleware } from "../utils/middleware.js";

export default async function handler(req, res) {
  // Handle CORS
  if (corsMiddleware(req, res)) return;

  if (req.method === 'POST') {
    const { user_id, items } = req.body;
    if (!user_id || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    const db = getDb();
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
  }
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
} 