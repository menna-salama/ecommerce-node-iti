const express = require("express");
const router = express.Router();
const { auth, restrictTo } = require("../middlewares/auth");
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCart,
} = require("../controllers/cart");

// Get cart
router.get("/", auth, restrictTo("user"), getCart);
// Add to cart
router.post("/", auth, restrictTo("user"), addToCart);
// Remove from cart
router.delete("/:id", auth, restrictTo("user"), removeFromCart);
// edit cart
router.patch("/:id", auth, restrictTo("user", "admin"), updateCart);

module.exports = router;
