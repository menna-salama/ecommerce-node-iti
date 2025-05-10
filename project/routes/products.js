const express = require("express");
const {
  getAllProduct,
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");
const upload = require("../middlewares/upload");
const { auth, restrictTo } = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, getAllProduct);
router.get("/my-products", auth, restrictTo("seller"), getMyProducts);
// router.gey("/:name", getAllProduct); // search by name

router.post(
  "/",
  upload.single("photo"),
  auth,
  restrictTo("seller"),
  createProduct
);

router.patch(
  "/:id",
  upload.single("photo"),
  auth,
  restrictTo("seller"),
  updateProduct
);

router.delete("/:id", auth, restrictTo("seller"), deleteProduct);

module.exports = router;
