const mongoose = require("mongoose");

// Define what each product document must look like in MongoDB
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0, default: 0 },
    reorderLevel: { type: Number, required: true, min: 0, default: 5 },
    supplier: { type: String, required: true, trim: true }
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
    toJSON: { virtuals: true }, // Ensures virtual fields show in JSON responses
    toObject: { virtuals: true }
  }
);

// Virtual field: Calculates stockValue (price * quantity) dynamically without storing extra data
productSchema.virtual("stockValue").get(function () {
  return this.price * this.quantity;
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = { ProductModel };