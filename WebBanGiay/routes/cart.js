const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.post('/cart/add', cartController.addToCart); // Thêm sản phẩm vào giỏ hàng


module.exports = router;