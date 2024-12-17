require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const app = express();
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
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/', indexRouter);

// Khởi động server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
