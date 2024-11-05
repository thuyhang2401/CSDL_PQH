const Product = require('../../models/product');

exports.getProducts = (req, res) => {
  res.render('index-admin', { title: 'Admin Dashboard' });
};