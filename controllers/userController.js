const account = require("../models/account");
const UserModel = require("../models/user");
const UserService = require("../services/user.service");
const userController = {
  getAllUsers: async (req, res) => {
    try {
      const User = await account.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "USER_ID",
            foreignField: "_id",
            as: "user",
          },
        },
      ]);
      res.status(200).json({
        message: "lấy thông tin người dùng thành công",
        success: true,
        data: User,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
  getAUser: async (req, res) => {
    try {
      const User = await account.findById(req.params.id).populate("USER_ID");
      res.status(200).json({
        message: "lấy thông tin người dùng thành công",
        success: true,
        data: User,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const accountToDelete = await account.findByIdAndDelete(req.params.id);
      if (!accountToDelete) {
        return res.status(404).json({
          message: "account not found",
        });
      }
      if (accountToDelete.USER_ID) {
        await UserModel.findByIdAndDelete(accountToDelete.USER_ID);
      }
      await account.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "User deleted", success: true });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  },
  getLoginUser: async (req, res) => {
    try {
      const user = await account.findById(req.user.id);
      res.status(200).json({
        message: "lấy thông tin người dùng đăng nhập thành công",
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({ err: error.message });
    }
  },
  getUserById: async (req, res) => {
    try {
      const user = await UserService.getUserById(req.params.id);
      res.status(200).json({
        message: "lấy thông tin người dùng thành công",
        success: true,
        data: user,
      });
    } catch (error) {
      console.error(error);
    }
  },
};
module.exports = userController;
