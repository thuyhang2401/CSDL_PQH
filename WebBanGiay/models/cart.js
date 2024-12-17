const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    accountId: {
        type: Number,
        required: true,
        description: "Mã tài khoản"
    },
    productId: {
        type: Number,
        required: true,
        description: "Mã sản phẩm"
    },
    purchaseQuantity: {
        type: Number,
        required: true,
        description: "Số lượng mua"
    }
});

module.exports = mongoose.model('Cart', cartSchema);