const PriceService = require("../services/price.service");
const { message } = require("../validation/addressValidator");
const priceController = {
  addPrice: async (req, res) => {
    try {
      const newPrice = await PriceService.addPrice(
        req.params.id,
        req.body.price_number,
        req.body.key,
        req.body.value,
        req.user.id
      );
      res.status(200).json({
        message: "Thêm giá thành công",
        success: true,
        data: newPrice,
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },
  getPrice: async (req, res) => {
    try {
      const id_product = req.params.id;
      const keys = req.body.key;
      const values = req.body.value;
      const getPrice = await PriceService.getPriceProduct(
        id_product,
        keys,
        values
      );
      res.status(200).json({
        message: "Lấy giá thành công",
        success: true,
        data: getPrice,
      });
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
  },
  updatePrice: async (req, res) => {
    try {
      const updatePrice = await PriceService.updatePrice(
        req.params.id_product,
        req.body.id_list_price,
        req.body.price_number
      );
      res.status(200).json({
        message: "Cập nhật giá thành công",
        success: true,
        data: updatePrice,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getPriceProduct: async (req, res) => {
    try {
      const getPriceProduct = await PriceService.getPriceProduct(
        req.params.id_product,
        req.body.key,
        req.body.value
      );
      res.status(200).json({
        message: "Lấy giá thành công",
        success: true,
        data: getPriceProduct,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getPriceWithoutKey: async (req, res) => {
    try {
      const getPriceWithoutKey = await PriceService.getPriceWithoutKey(
        req.params.id_priceDefault
      );
      if (getPriceWithoutKey.length > 0) {
        res.status(200).json({
          message: "Lấy giá thành công",
          success: true,
          data: getPriceWithoutKey,
        });
      } else {
        res.status(500).json({
          message: "sản phẩm chưa thêm giá mặc định",
          success: false,
        });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getPriceRange: async (req, res) => {
    try {
      const PriceRange = await PriceService.getPriceRange(
        req.params.id_product
      );
      if (PriceRange.length > 0) {
        res.status(200).json({
          message: "lấy giá thành công",
          success: true,
          data: PriceRange,
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "lỗi khi lấy khoảng giá",
        success: false,
        error: error.message,
      });
    }
  },
  getPriceByIdProduct: async (req, res) => {
    try {
      const response = await PriceService.getPriceByIdProduct(req.params.id);
      res.status(200).json({
        success: true,
        message: "Lấy giá theo id sản phẩm thành công",
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
  getMinPrice: async (req, res) => {
    try {
      const response = await PriceService.addPriceDefaultIsMinPrice(
        req.params.id
      );
      res.status(200).json({
        success: true,
        message: "Lấy giá nhỏ nhất thành công",
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
  deletePrice: async (req, res) => {
    try {
      const response = await PriceService.deletePrice(
        req.params.id,

        req.body.id_array
      );
      res.status(200).json({
        success: true,
        message: "Xóa giá thành công",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        success: false,
        message: "Xóa giá không thành công",
      });
    }
  },
  getKeyValueListPrice: async (req, res) => {
    try {
      const response = await PriceService.getKeyValueListPrice(
        req.params.id,
        req.user.id,
        req.body.id_array
      );
      res.status(200).json({
        success: true,
        message: "Lấy danh sách giá thành công",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        success: false,
        message: "Lỗii khi lấy danh sách giá",
      });
    }
  },
};
module.exports = priceController;
