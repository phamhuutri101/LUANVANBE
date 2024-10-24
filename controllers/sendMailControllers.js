const sendEmailServices = require("../services/emailService");
const UserService = require("../services/user.service");
const random = require("../utils/code");
const sendMailController = {
  sendMail: async (req, res) => {
    try {
      const code = random();
      await sendEmailServices.sendEmail(req.body.email, code);
      const activeAccount = await UserService.checkActiveByEmail(
        req.body.email
      );
      await UserService.addCodeActive(
        activeAccount[0]._id,
        code,
        "ACTIVE",
        300
      );
      res.status(200).json({
        message: "gửi OTP kích hoạt tài khoản thành công",
        success: true,
      });
    } catch (e) {
      res.status(500).json({
        message: e.message,
      });
    }
  },
  sendMailOrder: async (req, res) => {
    try {
      await sendEmailServices.sendMailOrder(req.body.email);
      res.status(200).json({
        message: "gửi thư cảm ơn thành công",
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        message: "lỗi khi gửi email",
        success: false,
      });
    }
  },
  sendMailShopAccount: async (req, res) => {
    try {
      await sendEmailServices.sendMaiStopAccount(
        req.body.email,
        req.body.name_account
      );
      res.status(200).json({
        message: "gửi thư thông báo tài khoản đã bị ngưng thành công",
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        message: "lỗi khi gửi email",
        success: false,
      });
    }
  },
  reactiveAccount: async (req, res) => {
    try {
      await sendEmailServices.sendReactiveAcount(
        req.body.email,
        req.body.name_account
      );
      res.status(200).json({
        message: "gửi thư thông báo tài khoản đã bị khôi phục thành công",
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        message: "lỗi khi gửi email",
        success: false,
      });
    }
  },
};
module.exports = sendMailController;
