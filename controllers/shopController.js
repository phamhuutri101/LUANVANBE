const ShopServices = require("../services/shop.services");
const ShopController = {
  checkTimeActiveShop: async (req, res) => {
    try {
      const response = await ShopServices.CheckTimeActive(
        req.user.id,
        req.user.id_user,
        req.body.name_shop,
        req.body.desc_shop
      );
      res.status(200).json({
        success: true,
        message: "Kiểm tra thời gian kích hoạt thành công",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  },
  activeShop: async (req, res) => {
    try {
      response = await ShopServices.activeShop(req.params.id);
      res.status(200).json({
        success: true,
        message: "Tài khoản đã được kích hoạt thành công",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  },
  checkActiveShop: async (req, res) => {
    try {
      const response = await ShopServices.checkActiveShop(req.user.id);

      // Kiểm tra nếu response không phải null hoặc undefined trước khi kiểm tra length
      if (response) {
        res.status(200).json({
          success: true,
          message: "Tài khoản đã được tạo trước đó",
          data: response,
        });
      } else {
        // Trường hợp không có shop nào được tạo
        res.status(200).json({
          success: false,
          message: "Tài khoản chưa tạo shop nào",
          data: null,
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  },
  getShopByAccountId: async (req, res) => {
    try {
      const response = await ShopServices.getShopByProductId(req.params.id);
      res.status(200).json({
        success: true,
        message: "Lấy thông tin shop thành công",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  },
  getShopNonActive: async (req, res) => {
    try {
      const response = await ShopServices.getShopNonActive();
      res.status(200).json({
        success: true,
        message: "Lấy thông tin shop chưa kích hoạt thành công",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  },
  getNameShopByIdAccount: async (req, res) => {
    try {
      const response = await ShopServices.getNameShopByIdAccount(req.params.id);
      res.status(200).json({
        success: true,
        message: "Lấy tên shop của tài khoản thành công",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  },
  getNameShopByIdAccountShopper: async (req, res) => {
    try {
      const response = await ShopServices.getNameShopByIdAccount(req.user.id);
      res.status(200).json({
        success: true,
        message: "Lấy tên shop của tài khoản thành công",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  },
};
module.exports = ShopController;
