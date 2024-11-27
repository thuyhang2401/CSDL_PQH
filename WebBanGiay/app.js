require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const app = express();
var methodOverride = require('method-override');
const authController = require('./controllers/authController');
const productController = require('./controllers/productController');
// Import routes
const indexRouter = require('./routes/index');
const path = require('path');

// Cấu hình EJS
app.set('view engine', 'ejs');
// Đảm bảo đúng thư mục views
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-default-secret',  // Cung cấp secret mặc định
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Nếu không sử dụng HTTPS, set secure: false
}));


// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/QuanLyBanGiay');

// test connection
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('MongoDB connection successful')
});

// Routes
app.use('/', indexRouter);
app.use('/WebBanGiay/admins', adminsRouter);;

// Khởi động server
module.exports = app;
