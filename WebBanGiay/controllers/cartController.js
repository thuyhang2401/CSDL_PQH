const Cart = require('../models/cart');

// Lấy giỏ hàng của một tài khoản
exports.getCartByAccountId = async (req, res) => {
    try {
        const cartItems = await Cart.find({ accountId: req.params.accountId });
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
    const { accountId, productId, purchaseQuantity } = req.body;

    const cartItem = new Cart({ accountId, productId, purchaseQuantity });

    try {
        await cartItem.save();
        res.redirect('/cart'); // Chuyển hướng đến trang giỏ hàng
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getCartByAccountId = async (req, res) => {
    try {
        // Gán tạm accountId vì chưa có đăng nhập
        const accountId = 'defaultUserId123'; // Giá trị tạm thời

        const cartItems = await Cart.find({ accountId: accountId }); // Lấy giỏ hàng của người dùng
        const total = cartItems.reduce((sum, item) => sum + item.price * item.purchaseQuantity, 0);

        res.render('cart', { cartItems, total }); // Gửi dữ liệu tới view
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
