const Account = require('../models/Account');

// Middleware kiểm tra quyền
const checkRole = (role) => {
  return async (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).send('Bạn phải đăng nhập để tiếp tục');
    }

    const account = await Account.findById(req.session.userId);

    if (account.role !== role) {
      return res.status(403).send('Bạn không có quyền truy cập');
    }

    next();
  };
};

module.exports = checkRole;
