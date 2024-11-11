const PromoCodeService = require("../services/PromoServices");

const PromoCodeController = {
  addPromoCode: async (req, res) => {
    try {
      const response = await PromoCodeService.addPromoCode(
        req.body.code,
        req.body.discountAmount,
        req.body.discountPercentage,
        req.body.to_date,
        req.body.minPurchase,
        req.user.id
      );
      if (!response) {
        return res.status(400).json({
          message: "mã khuyến mãi trùng",
          success: false,
        });
      } else {
        return res.status(200).json({
          message: "Thêm mã khuyến mãi thành công",
          success: true,
          data: response,
        });
      }
    } catch (error) {
      res.status(400).json({
        message: "Lỗi khi thêm Mã khuyến mãi",
        success: false,
        error: error.message,
      });
    }
  },
  checkPromoCode: async (req, res) => {
    try {
      const { code, orderTotal } = req.body;
      const result = await PromoCodeService.checkPromoCode(code, orderTotal);
      res.status(200).json({
        message: result.message,
        success: true,
        discount: result.discountValue,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
        success: false,
      });
    }
  },
  getAllPromoCodes: async (req, res) => {
    try {
      const promos = await PromoCodeService.getAllPromoCodes(
        req.params.id,
        req.query.page,
        req.query.limit
      );
      res.status(200).json({
        message: "Lấy danh sách mã khuyến mãi thành công",
        success: true,
        data: promos,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗii khi lấy danh sách mã khuyến mãi",
        success: false,
        error: error.message,
      });
    }
  },
  getAllPromoCodeShopper: async (req, res) => {
    try {
      const promos = await PromoCodeService.getAllPromoCodes(
        req.user.id,
        req.query.page,
        req.query.limit
      );
      res.status(200).json({
        message: "Lấy danh sách mã khuyến mãi thành công",
        success: true,
        data: promos,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗii khi lấy danh sách mã khuyến mãi",
        success: false,
        error: error.message,
      });
    }
  },
  checkActivePromoCode: async (req, res) => {
    try {
      const response = await PromoCodeService.checkActivePromoCode();
      res.status(200).json({
        message: "Kiếm tra thời hạn mã khuyến mãi thành công",
        success: true,
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        message: "Kiểm tra thời hạn khuyến mãi thất bại",
        success: false,
        error: error.message,
      });
    }
  },
  deletePromoCodes: async (req, res) => {
    try {
      const response = await PromoCodeService.deletePromoCodes(
        req.user.id,
        req.params.id
      );
      res.status(200).json({
        message: "Xóa mã khuyến mãi thành công",
        success: true,
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi xóa mã khuyến mãi",
        success: false,
        error: error.message,
      });
    }
  },
};
module.exports = PromoCodeController;
