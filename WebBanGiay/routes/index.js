const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');

router.use((req, res, next) => {
    res.locals.user = req.session.userId
        ? { loggedIn: true, role: req.session.isAdmin }
        : { loggedIn: false };
    next();
});
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
router.get('/WebBanGiay', (req, res) => {
    console.log("Route / is accessed");  // Thêm log để kiểm tra
    productController.getHomePage(req, res);  // Gọi controller để lấy trang chủ
  });
  
// Trang Admin (Phân quyền cho admin)
router.get('/admin', authController.isAdmin, (req, res) => {
    return res.redirect('/WebBanGiay/admins/products'); // Redirect dashboard dành cho admin
});

router.get('/', authController.isUser, (req, res) => {
    res.render('index');  // Render dashboard dành cho user
});

// Trang User (Phân quyền cho user)
router.get('/WebBanGiay', authController.isUser, (req, res) => {
    res.render('index');  // Render dashboard dành cho user
  });
router.get('/', authController.isUser, productController.getHomePage);

// Đăng xuất
router.get('/logout', authController.logout); 
module.exports = router;
