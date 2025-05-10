const express = require("express");
const router = express.Router();

const { makeOrder } = require("../controllers/orders");
const { auth, restrictTo } = require("../middlewares/auth");

router.post("/", auth, restrictTo("user"), makeOrder);

module.exports = router;
