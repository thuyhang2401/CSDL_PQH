const mongoose = require('mongoose'); 
const Cart = require('../models/cart');
const Product = require('../models/product'); 

// Lấy giỏ hàng của một tài khoản
exports.getCartByAccountId = async (req, res) => {
    try {
        const accountId = req.session.userId;
        if (!accountId) {
            return res.redirect('/login');
        }

        // Lấy các sản phẩm từ giỏ hàng của người dùng
        const cartItems = await Cart.find({ accountId }).lean();

        const populatedCartItems = await Promise.all(
            cartItems.map(async (item) => {
                const product = await Product.findOne({ _id: item.productId }).lean();
                if (product) {
                    return {
                        productId: item.productId,
                        image: product.image,
                        name: product.productName, 
                        price: product.price,
                        purchaseQuantity: item.purchaseQuantity
                    };
                } else {
                    return null;
                }
            })
        );

        // Lọc bỏ các mục không hợp lệ
        const validCartItems = populatedCartItems.filter(item => item !== null);

        // Tính tổng tiền giỏ hàng
        const total = validCartItems.reduce((sum, item) => sum + (item.price * item.purchaseQuantity), 0);

        // Trả về dữ liệu cho view
        res.render('cart', { cartItems: validCartItems, total });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Không thể lấy thông tin giỏ hàng.' });
    }
};

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.redirect('/login');
        }

        const productId = parseInt(req.body.productId, 10); 
        const size = req.body.size;
        const quantity = parseInt(req.body.quantity, 10);

        console.log('Received data:', { productId, size, quantity });

        if (quantity <= 0) {
            return res.status(400).send('Số lượng phải lớn hơn 0.');
        }

        const product = await Product.findOne({ _id: productId }); // Tìm sản phẩm bằng Number
        console.log('Found Product:', product);

        if (!product) {
            return res.status(404).send('Sản phẩm không tồn tại.');
        }

        if (product.quantity < quantity) {
            return res.status(400).send('Số lượng trong kho không đủ.');
        }

        product.quantity -= quantity;
        await product.save();

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingCartItem = await Cart.findOne({ accountId: userId, productId: productId });

        if (existingCartItem) {
            // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
            existingCartItem.purchaseQuantity += quantity;
            await existingCartItem.save();
        } else {
            // Nếu sản phẩm chưa có trong giỏ hàng, tạo mục mới
            const cartData = {
                accountId: new mongoose.Types.ObjectId(userId),
                productId: product._id,
                purchaseQuantity: quantity,
            };
            console.log('Adding to cart:', cartData);

            await Cart.create(cartData);
        }

        res.redirect('/WebBanGiay/cart');
    } catch (error) {
        console.error('Error adding to cart:', error.message);
        res.status(500).send('Lỗi khi thêm vào giỏ hàng.');
    }
};


// Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) {
            return res.redirect('/login');
        }

        const productId = parseInt(req.params.productId, 10); // Chuyển sang Number

        // Tìm và xóa sản phẩm khỏi giỏ hàng của người dùng
        const result = await Cart.findOneAndDelete({ accountId: userId, productId: productId });

        if (!result) {
            return res.status(404).send('Sản phẩm không tồn tại trong giỏ hàng.');
        }

        res.redirect('/WebBanGiay/cart');
    } catch (error) {
        console.error('Error removing from cart:', error.message);
        res.status(500).send('Lỗi khi xóa khỏi giỏ hàng.');
    }
};
