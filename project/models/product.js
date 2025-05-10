const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name Is Required"],
    minLength: [3, "must be at least 3"],
    unique: [true, "Name must be unique"],
  },

  description: { type: String, required: [true, "description is required"] },
  photo: { type: String },

  seller: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },

  createdAt: { type: Date, default: Date.now },
});

// model
const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
