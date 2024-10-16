const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const typeProductController = require("../controllers/typeProductController");
// Định nghĩa tuyến đường để lấy tất cả loại sản phẩm
router.get("/", typeProductController.getAll);
router.post("/", typeProductController.add);
module.exports = router;
