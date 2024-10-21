const FavoriteModel = require("../models/favorite");
const ObjectId = require("mongoose").Types.ObjectId;
class FavoriteService {
  static addFavorite = async (userId, productId) => {
    const USER_ID = new ObjectId(userId);
    const PRODUCT_ID = new ObjectId(productId);

    // Kiểm tra xem sản phẩm đã tồn tại trong danh sách yêu thích chưa
    const existingFavorite = await FavoriteModel.findOne({
      USER_ID: USER_ID,
      PRODUCT_ID: PRODUCT_ID,
    });

    if (existingFavorite) {
      // Nếu sản phẩm đã tồn tại, kiểm tra nếu đã là yêu thích thì không làm gì
      if (existingFavorite.IS_FAVORITE) {
        return existingFavorite; // Trả về bản ghi đã tồn tại
      }

      // Nếu sản phẩm đã tồn tại nhưng không phải là yêu thích, cập nhật thành yêu thích
      existingFavorite.IS_FAVORITE = true;
      existingFavorite.FROM_DATE = new Date(); // Cập nhật ngày yêu thích
      await existingFavorite.save();
      return existingFavorite; // Trả về bản ghi đã cập nhật
    } else {
      // Nếu sản phẩm chưa tồn tại trong danh sách yêu thích, thêm mới
      const newFavorite = new FavoriteModel({
        USER_ID: USER_ID,
        PRODUCT_ID: PRODUCT_ID,
        FROM_DATE: new Date(),
        TO_DATE: null,
        IS_FAVORITE: true,
      });
      await newFavorite.save();
      return newFavorite; // Trả về bản ghi mới
    }
  };

  static updateFavorite = async (userId, productId) => {
    const USER_ID = new ObjectId(userId);
    const PRODUCT_ID = new ObjectId(productId);
    const updateFavorite = await FavoriteModel.findOneAndUpdate(
      { USER_ID: USER_ID, PRODUCT_ID: PRODUCT_ID },
      {
        $set: {
          IS_FAVORITE: false,
          TO_DATE: new Date(),
        },
      },
      { new: true }
    );
    return updateFavorite;
  };
  static getFavorite = async (userId, productId) => {
    const USER_ID = new ObjectId(userId);
    const PRODUCT_ID = new ObjectId(productId);
    const favorite = await FavoriteModel.findOne({
      USER_ID: USER_ID,
      PRODUCT_ID: PRODUCT_ID,
    });
    return favorite;
  };
  static getProductFavorite = async (userId) => {
    const USER_ID = new ObjectId(userId);
    const productFavorite = await FavoriteModel.aggregate([
      {
        $match: {
          USER_ID: USER_ID,
          IS_FAVORITE: true,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "PRODUCT_ID",
          foreignField: "_id",
          as: "PRODUCT",
        },
      },
    ]);
    return productFavorite;
  };
}
module.exports = FavoriteService;
