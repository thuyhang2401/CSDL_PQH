const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { ensureLoggedIn } = require('../middleware/authMiddleware');
// Lấy giỏ hàng
router.get('/', cartController.getCartByAccountId);

// Thêm sản phẩm vào giỏ hàng
router.post('/add', cartController.addToCart);

// Xóa sản phẩm khỏi giỏ hàng 
router.get('/remove/:productId', cartController.removeFromCart);

module.exports = router;