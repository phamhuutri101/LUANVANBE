const ProductReviewsModel = require("../models/product_reviews");
const ObjectId = require("mongoose").Types.ObjectId;

class ProductReviews {
  static AddReviews = async (
    id_product,
    id_account,
    id_account_shop,
    number_start,
    desc_reviews,
    img_url,
    classify
  ) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const ID_ACCOUNT = new ObjectId(id_account);
    const ID_ACCOUNT_SHOP = new ObjectId(id_account_shop);

    // Chuyển đổi img_url từ chuỗi URL sang object chứa FILE_URL
    const listFile = img_url.map((fileUrl) => ({
      FILE_URL: fileUrl, // Chuyển mỗi URL thành object với FILE_URL
    }));

    // Tạo một object chứa đánh giá mới
    const newReview = {
      ID_PRODUCT: ID_PRODUCT,
      ID_ACCOUNT_SHOP: ID_ACCOUNT_SHOP,
      USER_ID: ID_ACCOUNT,
      NUMBER_OF_START: number_start,
      REVIEW_CONTENT: desc_reviews,
      IMG_URL: listFile, // Đảm bảo IMG_URL là mảng các object
      REVIEW_DATE: new Date(),
      CLASSIFY: classify,
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
  static GetNumberStartProduct = async (id_product) => {
    try {
      const ID_PRODUCT = new ObjectId(id_product);
      const reviews = await ProductReviewsModel.find({
        ID_PRODUCT: ID_PRODUCT,
      });

      if (reviews.length === 0) {
        return { averageRating: 0, totalReviews: 0 };
      }
      const totalStarts = reviews.reduce(
        (total, review) => total + review.NUMBER_OF_START,
        0
      );
      const averageRating = totalStarts / reviews.length;
      return { averageRating, totalReviews: reviews.length };
    } catch (error) {
      console.error(error);
    }
  };
  static getTotalReviewsByIdProduct = async (id_product) => {
    try {
      const response = await ProductReviewsModel.find({
        ID_PRODUCT: id_product,
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  };
  static getAllReviews = async (page = 1, limit = 10) => {
    page = Number(page);
    limit = Number(limit);
    try {
      const response = await ProductReviewsModel.aggregate([
        {
          $match: {
            IS_DELETE: false,
          },
        },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $lookup: {
            from: "products",
            localField: "ID_PRODUCT",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
        {
          $lookup: {
            from: "users",
            localField: "USER_ID",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $sort: {
            REVIEW_DATE: -1,
          },
        },
      ]);
      return response;
    } catch (error) {
      console.error(error);
    }
  };
  static getReviewsByAccountIdShop = async (
    account_id,
    page = 1,
    limit = 10
  ) => {
    const ACCOUNT_ID = new ObjectId(account_id);
    page = Number(page);
    limit = Number(limit);
    try {
      const response = await ProductReviewsModel.aggregate([
        {
          $match: {
            IS_DELETE: false,
            ID_ACCOUNT_SHOP: ACCOUNT_ID,
          },
        },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $lookup: {
            from: "products",
            localField: "ID_PRODUCT",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
        {
          $lookup: {
            from: "users",
            localField: "USER_ID",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $sort: {
            REVIEW_DATE: -1,
          },
        },
      ]);
      return response;
    } catch (error) {
      console.error(error);
    }
  };
  static getTotalReviews = async (id_user) => {
    const USER_ID = new ObjectId(id_user);
    try {
      const response = await ProductReviewsModel.aggregate([
        {
          $match: {
            IS_DELETE: false,
            USER_ID: USER_ID,
          },
        },
        {
          $count: "totalReviews",
        },
      ]);

      return response.length > 0 ? response[0].totalReviews : 0;
    } catch (error) {
      console.error(error);
    }
  };
}

module.exports = ProductReviews;
