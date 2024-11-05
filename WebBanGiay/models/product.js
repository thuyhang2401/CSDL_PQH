const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    image: {
        type: String
    },
    categoryId: {
        type: Number,
        ref: 'categories',
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    storageInstruction: {
        type: String,
    },
    tips: {
        type: String,
    }
});

module.exports = mongoose.model('products', productSchema);