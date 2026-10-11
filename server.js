const express = require("express");
require("dotenv").config();

const { connection } = require("./db");
const { productRouter } = require("./routes/product.route");

const app = express();

// Middleware to parse incoming JSON bodies
app.use(express.json());

// Mount the product routes under /api/products
app.use("/api/products", productRouter);


  // Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.log("Server Error:", err.message);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start the server
app.listen(PORT, async () => {
  try {
    await connection;
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
  console.log(`Server running on http://localhost:${PORT}`);
});