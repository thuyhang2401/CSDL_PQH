const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const accountSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

// Mã hóa mật khẩu trước khi lưu vào DB
accountSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Hàm kiểm tra mật khẩu
accountSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
