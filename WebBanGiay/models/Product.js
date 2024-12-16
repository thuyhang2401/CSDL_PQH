const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  categoryId: { type: Number, required: true },  
  // Keep categoryId as a Number
  color: { type: String, required: true },
  storageInstruction: { type: String, required: true },
  tips: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;
