const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Định nghĩa tuyến đường để lấy tất cả loại sản phẩm
router.get('/', productController.getAllTypeProducts);

module.exports = router;
