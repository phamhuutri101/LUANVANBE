const PromoCodeService = require("../services/PromoServices");

const PromoCodeController = {
  addPromoCode: async (req, res) => {
    try {
      const response = await PromoCodeService.addPromoCode(
        req.body.code,
        req.body.discountAmount,
        req.body.discountPercentage,
        req.body.to_date,
        req.body.minPurchase
      );
      res.status(200).json({
        message: "lưu khuyến mãi thành công",
        success: true,
        data: response,
      });
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
      const promos = await PromoCodeService.getAllPromoCodes();
      res.status(200).json({
        message: "Lấy danh sách mã khuyến mãi thành công",
        success: true,
        data: promos,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗii khi lấy danh sách mã khuyến mãi",
        success: false,
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
};
module.exports = PromoCodeController;
