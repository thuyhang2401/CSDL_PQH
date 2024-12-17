const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    categoryName: {
        type: String,
        required: true,
    }
}, { versionKey: false });

module.exports = mongoose.model('categories', categorySchema);