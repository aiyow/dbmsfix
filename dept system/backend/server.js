const express = require("express");
const mysql2 = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Multer setup for image upload (in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// MySQL connection pool
const db = mysql2.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "databasenicompas",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Check DB connection
db.getConnection((err) => {
  if (err) {
    console.error("Database connection failed", err);
  } else {
    console.log("Connected to MySQL database");
  }
});


// Register
app.post("/register", async (req, res) => {
  const { username, password, role, firstName, lastName, address, phone } = req.body;
  if (!username || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const checkUserSql = "SELECT * FROM register WHERE username = ?";
    db.query(checkUserSql, [username], (err, results) => {
      if (err) {
        console.error("DB Error on check:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      if (role === "customer") {
        // Handle customer with additional fields
        const insertCustomerSql = `
          INSERT INTO customers (username, password, role, first_name, last_name, address, phone)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(
          insertCustomerSql,
          [username, hashedPassword, role, firstName, lastName, address, phone],
          (err) => {
            if (err) {
              console.error("DB Error on insert:", err);
              return res.status(500).json({ message: "Registration failed", error: err });
            }
            return res.status(201).json({ message: "Customer registered successfully" });
          }
        );
      } else {
        // For staff and admin
        const insertUserSql = "INSERT INTO register (username, password, role) VALUES (?, ?, ?)";
        db.query(insertUserSql, [username, hashedPassword, role], (err) => {
          if (err) {
            console.error("DB Error on insert:", err);
            return res.status(500).json({ message: "Registration failed", error: err });
          }
          return res.status(201).json({ message: "User registered successfully" });
        });
      }
    });
  } catch (err) {
    console.error("Catch error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // First check register table (for employee, admin, etc.)
  const employeeSql = "SELECT * FROM register WHERE username = ?";
  db.query(employeeSql, [username], async (err, results) => {
    if (err) {
      console.error("DB error during employee login:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length > 0) {
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid username or password" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.json({
        message: "Login successful",
        token,
        username: user.username,
        role: user.role,
      });
    }

    // If not found in register, check customers table
    const customerSql = "SELECT * FROM customers WHERE username = ?";
    db.query(customerSql, [username], async (err, results) => {
      if (err) {
        console.error("DB error during customer login:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "Invalid username or password" });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid username or password" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login successful",
        token,
        username: user.username,
        role: user.role,
      });
    });
  });
});

// Sales Report Summary
app.get("/api/reports/sales", (req, res) => {
  const query = `
    SELECT
      total_sales_today,
      total_sales_week,
      total_sales_month,
      number_of_orders_today,
      number_of_orders_week
    FROM sales_report_view
    LIMIT 1
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching sales report", error: err });
    res.json(results[0] || {});
  });
});

// Inventory Report Summary
app.get("/api/reports/inventory", (req, res) => {
  const query = `
    SELECT
      total_products,
      out_of_stocks,
      low_stock_product,
      most_stocked_product
    FROM inventory_report_view
    LIMIT 1
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching inventory report", error: err });
    res.json(results[0] || {});
  });
});

// Transactions Report Summary
app.get("/api/reports/transactions", (req, res) => {
  const query = `
    SELECT
      total_transactions,
      pending_transaction,
      completed_transaction,
      refunded_transaction
    FROM transaction_report_view
    LIMIT 1
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching transaction report", error: err });
    res.json(results[0] || {});
  });
});

// Get all products
app.get("/api/products", (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching products", error: err });

    const formatted = results.map((product) => ({
      ...product,
      product_image: product.product_image
        ? Buffer.from(product.product_image).toString("base64")
        : null,
    }));

    res.json(formatted);
  });
});

// Add product
app.post("/api/products", upload.single("product_image"), (req, res) => {
  const { name, description, price, quantity } = req.body;
  const image = req.file ? req.file.buffer : null;

  const sql =
    "INSERT INTO products (name, description, price, quantity, product_image) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, description, price, quantity, image], (err) => {
    if (err) return res.status(500).json({ message: "Error adding product", error: err });
    res.json({ message: "Product added successfully" });
  });
});

// Update product
app.put("/api/products/:id", upload.single("product_image"), (req, res) => {
  const { name, description, price, quantity } = req.body;
  const image = req.file ? req.file.buffer : null;
  const { id } = req.params;

  let sql, values;
  if (image) {
    sql =
      "UPDATE products SET name = ?, description = ?, price = ?, quantity = ?, product_image = ? WHERE product_id = ?";
    values = [name, description, price, quantity, image, id];
  } else {
    sql =
      "UPDATE products SET name = ?, description = ?, price = ?, quantity = ? WHERE product_id = ?";
    values = [name, description, price, quantity, id];
  }

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ message: "Error updating product", error: err });
    res.json({ message: "Product updated successfully" });
  });
});

// Delete product
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM products WHERE product_id = ?";
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ message: "Error deleting product", error: err });
    res.json({ message: "Product deleted successfully" });
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
