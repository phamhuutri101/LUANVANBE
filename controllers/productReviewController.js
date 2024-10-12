const ProductReviewServices = require("../services/product_reviews.services");
const ProductReviews = {
  addReviews: async (req, res) => {
    try {
      const { number_start, desc_reviews, img_url, keys, values } = req.body;

      // Gọi service để thêm hoặc cập nhật đánh giá
      const result = await ProductReviewServices.AddReviews(
        req.params.id,
        req.user.id_user,
        number_start,
        desc_reviews,
        img_url,
        keys,
        values
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
};

module.exports = ProductReviews;
