module.exports = function (req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    } else {
        res.redirect('/login');
    }
};
