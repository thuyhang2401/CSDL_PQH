const mongoose = require('mongoose');

const sizeSchema = new mongoose.Schema({
    size35: { type: Number, required: true },
    size36: { type: Number, required: true },
    size37: { type: Number, required: true },
    size38: { type: Number, required: true },
    size39: { type: Number, required: true },
    size40: { type: Number, required: true },
    size41: { type: Number, required: true },
    size42: { type: Number, required: true },
    size43: { type: Number, required: true },
    size44: { type: Number, required: true },
    size45: { type: Number, required: true }
}, { _id: false });

const sizeQttSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    productId: {
        type: Number,
        ref: 'products',
        required: true,
        unique: true
    },
    sizes: {
        type: sizeSchema,
        required: true,
    }
});

module.exports = mongoose.model('sizequantities', sizeQttSchema);