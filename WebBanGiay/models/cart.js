const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'Account' 
    },
    productId: {
        type: Number,
        required: true,
        ref: 'products'
    },
    purchaseQuantity: {
        type: Number,
        required: true
    }
}, { versionKey: false });

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;