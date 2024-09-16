const FacoriteService = require("../services/favorite.service");
const FavoriteController = {
  addFavorite: async (req, res) => {
    try {
      const favorite = await FacoriteService.addFavorite(
        req.user.id,
        req.body.id_product
      );
      res.status(200).json({
        success: true,
        message: "Thêm yêu thích thành công",
        data: favorite,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  },

  deleteFavorite: async (req, res) => {
    try {
      const favorite = await FacoriteService.deleteFavorite(
        req.user.id,
        req.params.id
      );
      res.status(200).json({
        success: true,
        message: "Xóa yêu thích thành công",
        data: favorite,
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
module.exports = FavoriteController;
