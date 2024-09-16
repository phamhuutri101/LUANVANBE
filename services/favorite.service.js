const FavoriteModel = require("../models/favorite");
class FavotiteService {
  static addFavorite = async (userId, productId) => {
    const newFavorite = new FavoriteModel({
      USER_ID: userId,
      PRODUCT_ID: productId,
      FROM_DATE: new Date(),
    });
    await newFavorite.save();
    return newFavorite;
  };
}
module.exports = FavotiteService;
