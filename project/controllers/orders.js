const orderModel = require("../models/order");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.makeOrder = catchAsync(async (req, res, next) => {
  const products = req.body.products;
  if (!products || !Array.isArray(products) || products.length === 0)
    next(new AppError(400, "Please provide a valid products"));

  //
  const order = await orderModel.create({
    user: req.id,
    products: products,
    payment: req.body.payment,
  });

  //   if (req.body.paymentMethod === "online") {
  //     //   Placeholder for online payment processing
  //     console.log("Online payment processing would go here (e.g., Stripe)");
  //     //   In a real app, you'd integrate with a payment gateway like Stripe:
  //     const paymentIntent = await stripe.paymentIntents.create({
  //       amount: calculateTotal(order.products),
  //       currency: "usd",
  //       payment_method: req.body.payment,
  //       confirm: true,
  //     });
  //   }

  res.status(200).json({
    status: "success",
    data: order,
    message: "Order created successfully",
  });
});
