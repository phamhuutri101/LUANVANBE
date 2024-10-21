const FavoriteService = require("../services/favorite.service");
const FavoriteController = {
  addFavorite: async (req, res) => {
    try {
      const favorite = await FavoriteService.addFavorite(
        req.user.id,
        req.params.id
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
  updateFavorite: async (req, res) => {
    try {
      const response = await FavoriteService.updateFavorite(
        req.user.id,
        req.params.id
      );
      res.status(200).json({
        success: true,
        message: "Cập nhật yêu thích thành công",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  },
  getFavorite: async (req, res) => {
    try {
      const favorites = await FavoriteService.getFavorite(
        req.user.id,
        req.params.id
      );
      res.status(200).json({
        success: true,
        message: "Lấy yêu thích thành công",
        data: favorites,
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
      const favorite = await FavoriteService.deleteFavorite(
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
  getProductFavorite: async (req, res) => {
    try {
      const productFavorite = await FavoriteService.getProductFavorite(
        req.user.id
      );
      res.status(200).json({
        success: true,
        message: "Lấy sản phẩm yêu thích thành công",
        data: productFavorite,
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
