const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  _id: { type: Number },  // Sử dụng Number cho _id
  categoryName: { type: String, required: true }
}, { versionKey: false });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;