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
};
module.exports = sendMailController;
