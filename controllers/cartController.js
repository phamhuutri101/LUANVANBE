const CartService = require("../services/cart.service");
const { message } = require("../validation/addressValidator");
const cartController = {
  addCart: async (req, res) => {
    try {
      if (req.body.key && req.body.value) {
        const newCart = await CartService.addCartKV(
          req.user.id_user,
          req.params.id,
          req.body.key,
          req.body.value,
          req.body.number
        );
        res.status(200).json({
          message: "Thêm sản phẩm thành công",
          success: true,
          data: newCart,
        });
      } else {
        const newCart = await CartService.addCartNonKV(
          req.user.id_user,
          req.params.id
        );
        res.status(200).json({
          message: "Thêm sản phẩm thành công",
          success: true,
          data: newCart,
        });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getCart: async (req, res) => {
    try {
      const getCart = await CartService.getCart(
        req.user.id_user,
        req.query.page,
        req.query.limit
      );
      res.status(200).json({
        message: "Lấy giỏ hàng thành công",
        success: true,
        data: getCart,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateCart: async (req, res) => {
    try {
      const updateCart = await CartService.updateCart(
        req.user.id_user,
        req.params.id,
        req.body.price
      );
      res.status(200).json({
        message: "Cập nhật giỏ hàng thành công",
        success: true,
        data: updateCart,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateNumberCart: async (req, res) => {
    try {
      // const updateNumberCart = await CartService.updateNumberCart(
      //   req.user.id_user,
      //   req.body.id_product,
      //   req.body.list_match_key,
      //   req.body.numberCart
      // );

      const updateNumberCart = await CartService.updateNumberCart(
        req.user.id_user,
        req.body.id_product,
        req.body.id_list_product,
        req.body.numberCart
      );
      res.status(200).json({
        message: "Cập nhật giỏ hàng thành công",
        success: true,
        data: updateNumberCart,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteCart: async (req, res) => {
    try {
      const deleteCart = await CartService.deleteCart(
        req.user.id_user,
        req.params.id
      );
      res.status(200).json({
        message: "xóa thành công",
        success: true,
        data: deleteCart,
      });
    } catch (error) {
      console.error(error);
    }
  },
};
module.exports = cartController;
