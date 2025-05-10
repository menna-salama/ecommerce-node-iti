const productModel = require("../models/product");
const { catchAsync } = require("../utils/catchAsync");
const userModel = require("../models/user");
const AppError = require("../utils/AppError");

// get all products and search by name and seller id
exports.getAllProduct = catchAsync(async (req, res, next) => {
  const { search } = req.query;
  let query = {};

  if (search) {
    if (!req.id) {
      return next(
        new AppError(401, "You must be logged in to search products")
      );
    }
    query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        {
          seller: {
            $in: await userModel
              .find({ userName: { $regex: search, $options: "i" } })
              .select("_id"),
          },
        },
      ],
    };
  }
  let products = await productModel.find(query).populate("seller");

  res.status(200).json({ message: "success", data: products });
});

// get myproducts
exports.getMyProducts = catchAsync(async (req, res, next) => {
  let products = await productModel.find({ seller: req.id }).populate("seller");

  res.status(200).json({ message: "success", data: products });
});

// create
exports.createProduct = catchAsync(async (req, res, next) => {
  let newProduct = req.body;
  if (req.file) {
    newProduct.photo = `/uploads/${req.file.filename}`;
  }

  let product = await productModel.create({ ...newProduct, seller: req.id });

  return res.status(201).json({
    message: "success",
    data: product,
  });
});

// update product
exports.updateProduct = catchAsync(async (req, res, next) => {
  let { id } = req.params;
  let updatedProduct = req.body;

  let product = await productModel.findByIdAndUpdate(id, updatedProduct, {
    new: true,
  });

  if (!product) {
    return next(new AppError(404, "Product not found"));
  }

  if (product.seller.toString() !== req.id)
    return next(
      new AppError(403, "You are not allowed to delete this product")
    );

  if (req.file) {
    updatedProduct.photo = `/uploads/${req.file.filename}`;
  }

  return res.status(200).json({
    message: "success",
    data: product,
  });
});

// delete product
exports.deleteProduct = catchAsync(async (req, res, next) => {
  let { id } = req.params;
  let product = await productModel.findById(id);
  if (!product) {
    return next(new AppError(404, "Product not found"));
  }

  if (product.seller.toString() !== req.id)
    return next(
      new AppError(403, "You are not allowed to delete this product")
    );

  await productModel.findByIdAndDelete(id);

  return res.status(204).json({
    message: "success",
    data: null,
  });
});
