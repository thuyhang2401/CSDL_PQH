const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('..//models/Account'); // Thay đổi đường dẫn này theo cấu trúc thư mục của bạn

passport.use(new LocalStrategy(
  {
    usernameField: 'username', // Trường tên tài khoản
    passwordField: 'password', // Trường mật khẩu
  },
  (username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Incorrect username.' });
      if (!user.validPassword(password)) { // Hàm kiểm tra mật khẩu trong model User
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user); // Nếu đăng nhập thành công
    });
  }
));

// Định nghĩa cách Passport serialize và deserialize người dùng
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
