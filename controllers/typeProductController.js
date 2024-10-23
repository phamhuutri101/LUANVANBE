const TypeProduct = require("../services/typeProduct.service");
const addTypeProductController = {
  add: async (req, res) => {
    try {
      const response = await TypeProduct.createTypeProduct(
        req.body.name_type,
        req.body.avt_url
      );
      res.status(200).json({
        success: true,
        message: "Thêm loại sản phẩm thành công",
        data: response,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
        success: false,
      });
    }
  },
  getAll: async (req, res) => {
    try {
      const response = await TypeProduct.getAllTypeProducts();
      res.status(200).json({
        success: true,
        message: "Lấy tất cả loại sản phẩm thành công",
        data: response,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
        success: false,
      });
    }
  },
  getCategoriesByTypeProduct: async (req, res) => {
    try {
      const response = await TypeProduct.getCategoriesByTypeProduct(
        req.params.id
      );
      res.status(200).json({
        success: true,
        message: "Lấy danh sách danh mục theo loại sản phẩm thành công",
        data: response,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
        success: false,
      });
    }
  },
  getProductCategoriesByTypeProduct: async (req, res) => {
    try {
      const response = await TypeProduct.getProductCategoriesByTypeProduct(
        req.params.id
      );
      res.status(200).json({
        success: true,
        message: "Lấy danh sách danh mục theo loại sản phẩm thành công",
        data: response,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
        success: false,
      });
    }
  },
};
module.exports = addTypeProductController;
