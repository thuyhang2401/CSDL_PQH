const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    categotyName: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('categories', categorySchema);