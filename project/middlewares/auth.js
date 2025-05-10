const { json } = require("express");
const jwt = require("jsonwebtoken");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.auth = catchAsync(function (req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) return next();

  //   Token verification
  let decoded = jwt.verify(authorization, process.env.SECRET);
  console.log(decoded);

  req.id = decoded.id;
  req.role = decoded.role;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role))
      return next(new AppError(403, "you don't have permission"));
    else next();
  };
};
