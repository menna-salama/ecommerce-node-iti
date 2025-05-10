const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: [true, "user is required"],
  },
  products: [
    {
      product: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Product",
        required: [true, "Cart must contain at least one product"],
      },
      quantity: {
        type: Number,
        min: [1, "Quantity must be at least 1"],
        default: 1,
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

cartSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "userName email" }).populate({
    path: "products.product",
    select: "name description photo",
  });
  next();
});

const cartModel = mongoose.model("Cart", cartSchema);

module.exports = cartModel;
