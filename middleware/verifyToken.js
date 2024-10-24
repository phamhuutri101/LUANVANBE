const jwt = require("jsonwebtoken");
const verify = {
  verityToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token;
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          return res.status(403).json({
            message: "token không tồn tại",
            success: false,
          });
        }
        req.user = user;
        next();
      });
    } else {
      return res.status(403).json({
        message: "bạn chưa xác thực token",
        success: false,
      });
    }
  },

  checkPermissionShopper: (req, res, next) => {
    const user = req.user;
    if (user && user.shopper == true) {
      next();
    } else {
      return res.status(403).json({
        message: "bạn không có quyền truy cập khi bạn chưa là người bán",
        success: false,
      });
    }
  },
  checkPermissionAdmin: (req, res, next) => {
    const user = req.user;
    if (user && user.admin == true) {
      next();
    } else {
      return res.status(403).json({
        message: "bạn không có quyền truy cập trang này dành cho admin",
        success: false,
      });
    }
  },
};
module.exports = verify;
