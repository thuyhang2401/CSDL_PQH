const express = require('express');
const router = express.Router();

const productController = require('../controllers/admin/productController');

router.get('/products', productController.getProducts);
router.post('/addProduct', productController.addProduct);
router.get('/products/:productId', productController.getProductById);

module.exports = router;
