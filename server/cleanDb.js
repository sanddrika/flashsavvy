import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQLite DB setup
const dbPath = path.join(__dirname, "flashsavvy.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database error:", err);
    process.exit(1);
  }
  console.log("Connected to SQLite database.");
});

// Clean the database
db.serialize(() => {
  // Delete all users
  db.run("DELETE FROM users", (err) => {
    if (err) {
      console.error("Error deleting users:", err);
    } else {
      console.log("All users deleted successfully");
    }
  });

  // Delete all orders and order items
  db.run("DELETE FROM order_items", (err) => {
    if (err) {
      console.error("Error deleting order items:", err);
    } else {
      console.log("All order items deleted successfully");
    }
  });

  db.run("DELETE FROM orders", (err) => {
    if (err) {
      console.error("Error deleting orders:", err);
    } else {
      console.log("All orders deleted successfully");
    }
  });

  // Close the database connection when done
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err);
    } else {
      console.log("Database connection closed.");
    }
    process.exit(0);
  });
}); 