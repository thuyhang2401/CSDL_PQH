const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');
// Trang đăng ký
router.get('/register', (req, res) => {
    res.render('login_signup');  // Render form đăng ký
});

router.post('/register', authController.register);  // Xử lý đăng ký

// Trang đăng nhập
router.get('/login', (req, res) => {
    res.render('login_signup');  // Render form đăng nhập
});

router.post('/login', authController.login);  // Xử lý đăng nhập
router.get('/dashboard', (req, res) => {
    console.log("Route / is accessed");  // Thêm log để kiểm tra
    productController.getHomePage(req, res);  // Gọi controller để lấy trang chủ
  });
// Trang Admin (Phân quyền cho admin)
router.get('/admin', authController.isAdmin, (req, res) => {
    res.render('index_admin');  // Render dashboard dành cho admin
});
router.get('/', authController.isUser, (req, res) => {
    res.render('index');  // Render dashboard dành cho user
});
// Trang User (Phân quyền cho user)
router.get('/dashboard', authController.isUser, (req, res) => {
    res.render('index');  // Render dashboard dành cho user
  });
router.get('/', authController.isUser, productController.getHomePage);
module.exports = router;
