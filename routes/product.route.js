const express = require("express");
const { ProductModel } = require("../model/product.model");

const productRouter = express.Router();

// 1. LOW STOCK REPORT: Items where quantity <= reorderLevel
productRouter.get("/low-stock", async (req, res) => {
  try {
    const allProducts = await ProductModel.find();
    // Simple JavaScript filter to find low stock items
    const lowStockItems = allProducts.filter(
      (item) => item.quantity <= item.reorderLevel
    );

    res.status(200).json({
      count: lowStockItems.length,
      lowStockItems: lowStockItems,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. CATEGORY SUMMARY: Group by category
productRouter.get("/summary", async (req, res) => {
  try {
    const summary = await ProductModel.aggregate([
      {
        $group: {
          _id: "$category",
          totalItems: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalStockValue: { $sum: { $multiply: ["$price", "$quantity"] } },
          avgPrice: { $avg: "$price" },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          totalItems: 1,
          totalQuantity: 1,
          totalStockValue: 1,
          avgPrice: { $round: ["$avgPrice", 1] },
        },
      },
    ]);

    res.status(200).json({
      categories: summary.length,
      summary: summary,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. CREATE PRODUCT (POST)
productRouter.post("/", async (req, res) => {
  try {
    const product = new ProductModel(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. GET ALL PRODUCTS (With simple filtering and pagination, no parseInt)
productRouter.get("/", async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const skip = (page - 1) * limit;

    let filter = {};

    // Filter by category if given in query string (?category=Furniture)
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Search by product name if given (?search=Table)
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: "i" };
    }

    const total = await ProductModel.countDocuments(filter);
    const products = await ProductModel.find(filter).skip(skip).limit(limit);

    res.status(200).json({
      total: total,
      page: page,
      totalPages: Math.ceil(total / limit),
      count: products.length,
      products: products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. GET SINGLE PRODUCT BY ID
productRouter.get("/:id", async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. UPDATE PRODUCT (PUT)
productRouter.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 7. STOCK ADJUSTMENT (PATCH /:id/stock)
productRouter.patch("/:id/stock", async (req, res) => {
  try {
    const { change } = req.body;
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Add or subtract change
    product.quantity = product.quantity + change;
    await product.save();

    res.status(200).json({
      message: "Stock updated",
      product: product,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 8. DELETE PRODUCT (DELETE)
productRouter.delete("/:id", async (req, res) => {
  try {
    const product = await ProductModel.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      message: "Product deleted",
      id: req.params.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = { productRouter };