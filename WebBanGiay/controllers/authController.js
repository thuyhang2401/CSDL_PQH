const Account = require('../models/Account');

// Đăng ký tài khoản
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingAccount = await Account.findOne({ email });
        if (existingAccount) {
            return res.status(400).json({ success: false, message: 'Email đã được sử dụng' });
        }

        const account = new Account({ username, email, password });
        await account.save();
        res.status(200).json({ success: true, message: 'Đăng ký thành công!' });
    } catch (err) {
        console.error('Lỗi server:', err); 
        res.status(500).json({ success: false, message: 'Lỗi server' });  // Đảm bảo trả về JSON
    }
};
// Đăng nhập
// Đăng nhập
exports.login = async (req, res) => {
    const { email, password } = req.body;  // Dùng email thay vì username

    try {
        const account = await Account.findOne({ email });  // Tìm tài khoản theo email
        if (!account) {
            console.log('Không tìm thấy tài khoản với email:', email);  // In ra email không tìm thấy
            return res.status(400).send('Tài khoản không tồn tại');
        }

        const isMatch = await account.comparePassword(password);
        if (!isMatch) {
            console.log('Mật khẩu sai cho tài khoản với email:', email);  // In ra thông báo mật khẩu sai
            return res.status(400).send('Mật khẩu sai');
        }

        req.session.userId = account._id;
        req.session.role = account.role;

        if (account.role === 'admin') {
            return res.redirect('/admin');
        } else {
            return res.redirect('/dashboard');
        }
    } catch (err) {
        console.error('Lỗi server:', err);  // In lỗi ra console
        res.status(500).send('Lỗi server');
    }
};

// Middleware kiểm tra quyền admin
exports.isAdmin = (req, res, next) => {
    if (req.session.role !== 'admin') {
        return res.status(403).send('Không có quyền truy cập');
    }
    next();
};

// Middleware kiểm tra quyền user
exports.isUser = (req, res, next) => {
    if (req.session.role !== 'user') {
        return res.status(403).send('Không có quyền truy cập');
    }
    next();
};

//Logout
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Lỗi khi đăng xuất');
        }
        res.redirect('/dashboard');
    });
};