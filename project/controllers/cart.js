const cartModel = require("../models/cart");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.getCart = catchAsync(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.id });
  res.status(200).json({
    status: "success",
    data: cart,
  });
});

// addToCart
exports.addToCart = catchAsync(async (req, res, next) => {
  const newProduct = req.body;

  if (!newProduct.product)
    return next(new AppError(400, "please select product"));

  let getCart = await cartModel.findOne({ user: req.id });

  // if cart exist or not
  if (getCart) {
    const productIndex = getCart.products.findIndex(
      (item) => item.product.toString() === newProduct.product
    );

    // if exist
    if (productIndex > -1) {
      getCart.products[productIndex].quantity += newProduct.quantity || 1;
    } else {
      getCart.products.push({
        product: newProduct.product,
        quantity: newProduct.quantity || 1,
      });
    }
    await getCart.save();
    // if not cart and create it
  } else {
    getCart = await cartModel.create({
      user: req.id,
      products: [
        { product: newProduct.product, quantity: newProduct.quantity || 1 },
      ],
    });
  }

  res.status(201).json({
    status: "success",
    data: getCart,
    message: "added to cart",
  });
});

// removeFromCart
exports.removeFromCart = catchAsync(async (req, res, next) => {
  let { id } = req.params;
  let cart = await cartModel.findOne({ user: req.id });

  if (!cart) return next(new AppError(404, "cart not found"));

  const productIndex = cart.products.findIndex(
    (item) => item.product._id.toString() == id
  );

  if (productIndex == -1)
    return next(new AppError(404, "Product not found in cart"));

  cart.products.splice(productIndex, 1);
  await cart.save();
  return res.status(20).json({
    status: "success",
    message: "Product removed from cart",
    data: null,
  });
});

// updateCart
exports.updateCart = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userRole = req.role;

  let cart = await cartModel.findById(id);

  if (!cart) {
    return next(new AppError(404, "Cart not found"));
  }

  if (userRole !== "admin" && cart.user._id.toString() !== req.id) {
    return next(new AppError(403, "You don't have permission"));
  }

  cart.products = req.body.products;

  await cart.save();

  res.status(200).json({
    status: "success",
    data: cart,
    message: "Cart updated successfully",
  });
});
