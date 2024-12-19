const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Lấy tất cả sản phẩm
router.get('/', productController.getProducts);

// Lấy sản phẩm theo ID
router.get('/product-single/:id', productController.getProductById);

module.exports = router;
