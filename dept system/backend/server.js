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
  console.log("Incoming registration data:", req.body);

  const { username, password, role, firstName, lastName, address, phone, email } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: "All required fields are missing." });
  }

  if (role === "customer" && (!firstName || !lastName || !address || !phone || !email)) {
    return res.status(400).json({
      message: "Please provide all customer details: first name, last name, address, phone, and email.",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const checkUsernameQuery = `
      SELECT username FROM register WHERE username = ?
      UNION ALL
      SELECT username FROM customers WHERE username = ?
    `;

    db.query(checkUsernameQuery, [username, username], (err, results) => {
      if (err) {
        console.error("DB Error on check:", err);
        return res.status(500).json({ message: "Database error during username check.", error: err });
      }

      if (results.length > 0) {
        return res.status(409).json({ message: "Username already exists. Please choose a different one." });
      }

      if (role === "customer") {
        const insertCustomerSql = `INSERT INTO customers (username, password, first_name, last_name, email, phone, address, role)
                                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(
          insertCustomerSql,
          [username, hashedPassword, firstName, lastName, email, phone, address, role],
          (err) => {
            if (err) {
              console.error("DB Error on insert customer:", err);
              return res.status(500).json({ message: "Failed to register customer due to a database error." });
            }
            res.status(201).json({ message: "Customer registered successfully!" });
          }
        );
      } else {
        const insertUserSql = "INSERT INTO register (username, password, role) VALUES (?, ?, ?)";
        db.query(insertUserSql, [username, hashedPassword, role], (err) => {
          if (err) {
            console.error("DB Error on insert (user):", err);
            return res.status(500).json({ message: "Failed to register user (admin/staff) due to a database error.", error: err });
          }
          return res.status(201).json({ message: `${role} registered successfully!` });
        });
      }
    });
  } catch (err) {
    console.error("Server catch error during registration:", err);
    res.status(500).json({ message: "Server error during registration.", error: err.message });
  }
});

// Login (fixed)
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Shared login logic
  const handleLogin = async (user, res) => {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const role = user.role?.trim().toLowerCase();

    // Optional: only allow specific known roles
    if (!["admin", "manager", "staff", "employee", "customer"].includes(role)) {
      return res.status(403).json({ message: "Unrecognized user role" });
    }

    const token = jwt.sign(
      {
        id: user.id || user.customer_id,
        username: user.username,
        role: role, // Use normalized role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      username: user.username,
      role: role, // Always send back lowercase role
    });
  };

  // First try admin/staff login
  const checkEmployeeSql = "SELECT * FROM register WHERE username = ?";
  db.query(checkEmployeeSql, [username], async (err, results) => {
    if (err) {
      console.error("DB error during employee login:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length > 0) {
      return handleLogin(results[0], res);
    }

    // If not found, try customer
    const checkCustomerSql = "SELECT * FROM customers WHERE username = ?";
    db.query(checkCustomerSql, [username], async (err, results) => {
      if (err) {
        console.error("DB error during customer login:", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "Invalid username or password" });
      }

      return handleLogin(results[0], res);
    });
  });
});

// SALES REPORT VIEW
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

// INVENTORY REPORT VIEW
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

// TRANSACTION REPORT VIEW
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

// GET PRODUCTS
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

// ADD PRODUCT
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

// UPDATE PRODUCT
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

// DELETE PRODUCT
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
