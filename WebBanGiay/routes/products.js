const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Lấy tất cả sản phẩm
router.get('/', productController.getProducts);

// Lấy sản phẩm theo ID
router.get('/product-single/:id', productController.getProductById);

// Thêm sản phẩm mới
router.post('/add', productController.addProduct);

// Xóa sản phẩm
router.post('/delete', productController.deleteProduct);

// Cập nhật sản phẩm
router.post('/update', productController.updateProduct);

module.exports = router;
