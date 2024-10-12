const ProductReviewsModel = require("../models/product_reviews");
const ObjectId = require("mongoose").Types.ObjectId;

class ProductReviews {
  static AddReviews = async (
    id_product,
    id_account,
    number_start,
    desc_reviews,
    img_url,
    keys = [],
    values = []
  ) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const ID_ACCOUNT = new ObjectId(id_account);
    let details = [];

    // Kiểm tra keys và values
    if (
      Array.isArray(keys) &&
      Array.isArray(values) &&
      keys.length === values.length
    ) {
      for (let i = 0; i < keys.length; i++) {
        details.push({
          KEY: keys[i],
          VALUE: values[i],
        });
      }
    }

    // Tạo một object chứa đánh giá mới
    const newReview = {
      ID_PRODUCT: ID_PRODUCT,
      USER_ID: ID_ACCOUNT,
      NUMBER_OF_START: number_start,
      REVIEW_CONTENT: desc_reviews,
      IMG_URL: img_url,
      LIST_MATCH_KEY: details,
    };

    // Cập nhật hoặc thêm mới đánh giá
    try {
      const existingReview = await ProductReviewsModel.findOne({
        ID_PRODUCT: ID_PRODUCT,
        USER_ID: ID_ACCOUNT,
      });

      if (existingReview) {
        // Nếu đã có đánh giá của người dùng này cho sản phẩm, cập nhật đánh giá
        existingReview.NUMBER_OF_START = number_start;
        existingReview.REVIEW_CONTENT = desc_reviews;
        existingReview.IMG_URL = img_url;
        existingReview.LIST_MATCH_KEY = details;

        await existingReview.save();
      } else {
        // Nếu chưa có đánh giá, tạo đánh giá mới
        await ProductReviewsModel.create(newReview);
      }

      return {
        success: true,
        message: "Đánh giá đã được thêm/cập nhật thành công.",
      };
    } catch (error) {
      console.error("Lỗi khi thêm đánh giá:", error);
      return { success: false, message: "Có lỗi xảy ra khi thêm đánh giá." };
    }
  };
}

module.exports = ProductReviews;
