const ProductService = require("../services/product.service");
const ProductReviewServices = require("../services/product_reviews.services");
const ProductReviews = {
  addReviews: async (req, res) => {
    try {
      const { number_start, desc_reviews, img_url, keys, values, classify } =
        req.body;

      // Gọi service để thêm hoặc cập nhật đánh giá
      const result = await ProductReviewServices.AddReviews(
        req.params.id,
        req.user.id_user,
        req.body.id_order,
        req.body.id_account_shop,
        req.body.number_start,
        req.body.desc_reviews,
        req.body.img_url,
        req.body.classify
      );

      if (result.success) {
        res.status(200).json({
          message: result.message,
          success: true,
          data: result,
        });
      } else {
        res.status(400).json({
          message: result.message,
          success: false,
        });
      }
    } catch (error) {
      console.error("Error adding review:", error);
      res.status(500).json({
        message: "Lỗi khi thêm đánh giá.",
        success: false,
      });
    }
  },
  getNumberStartProduct: async (req, res) => {
    try {
      const result = await ProductReviewServices.GetNumberStartProduct(
        req.params.id
      );

      res.status(200).json({
        message: "Lấy số đánh giá thành công",
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(error);
    }
  },
  getTotalReviewsByIdProduct: async (req, res) => {
    try {
      const result = await ProductReviewServices.getTotalReviewsByIdProduct(
        req.params.id
      );
      res.status(200).json({
        message: "Lấy tất cả đánh giá thành công",
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy tất cả đánh giá",
        success: false,
      });
    }
  },
  getAllReviews: async (req, res) => {
    try {
      const response = await ProductReviewServices.getAllReviews(
        req.query.page,
        req.query.limit
      );
      res.status(200).json({
        message: "Lấy tất cả đánh giá thành công",
        success: true,
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy tất cả đánh giá",
        success: false,
        error: error.message,
      });
    }
  },
  getAllReviewsShop: async (req, res) => {
    try {
      const response = await ProductReviewServices.getReviewsByAccountIdShop(
        req.user.id,
        req.query.page,
        req.query.limit
      );
      res.status(200).json({
        message: "Lấy tất cả đánh giá thành công",
        success: true,
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        message: "Lỗi khi lấy tất cả đánh giá",
        success: false,
        error: error.message,
      });
    }
  },
  getTotalReviewShop: async (req, res) => {
    try {
      const response = await ProductReviewServices.getTotalReviews(
        req.params.id
      );
      res.status(200).json({
        message: "Lấy t��ng số đánh giá thành công",
        success: true,
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        message: "L��i khi lấy t��ng số đánh giá",
        success: false,
        error: error.message,
      });
    }
  },
  is_review: async (req, res) => {
    try {
      const response = await ProductReviewServices.is_review(
        req.params.id,
        req.user.id_user
      );
      res.status(200).json({
        message: "Kiểm tra đánh giá thành công",
        success: true,
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        message: "lỗi khi kiểm tra đánh giá",
        success: false,
        error: error.message,
      });
    }
  },
};

module.exports = ProductReviews;
