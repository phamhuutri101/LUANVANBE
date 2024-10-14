const ProductReviewsModel = require("../models/product_reviews");
const ObjectId = require("mongoose").Types.ObjectId;

class ProductReviews {
  static AddReviews = async (
    id_product,
    id_account,
    number_start,
    desc_reviews,
    img_url
  ) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const ID_ACCOUNT = new ObjectId(id_account);

    // Chuyển đổi img_url từ chuỗi URL sang object chứa FILE_URL
    const listFile = img_url.map((fileUrl) => ({
      FILE_URL: fileUrl, // Chuyển mỗi URL thành object với FILE_URL
    }));

    // Tạo một object chứa đánh giá mới
    const newReview = {
      ID_PRODUCT: ID_PRODUCT,
      USER_ID: ID_ACCOUNT,
      NUMBER_OF_START: number_start,
      REVIEW_CONTENT: desc_reviews,
      IMG_URL: listFile, // Đảm bảo IMG_URL là mảng các object
    };

    // Cập nhật hoặc thêm mới đánh giá
    try {
      await ProductReviewsModel.create(newReview);
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
