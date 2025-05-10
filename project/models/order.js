const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
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
        required: [true, "Product is Required"],
      },
      quantity: {
        type: Number,
        min: [1, "Quantity is require"],
        default: 1,
      },
    },
  ],
  payment: {
    type: String,
    enum: ["cash", "online"],
    default: "cash",
  },

  createdAt: { type: Date, default: Date.now },
});

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "userName email" }).populate({
    path: "products.product",
    select: "name description photo",
  });
  next();
});

const orderModel = mongoose.model("Order", orderSchema);
module.exports = orderModel;
