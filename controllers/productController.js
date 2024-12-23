const ProductService = require("../services/product.service");
const { productSchema } = require("../validation/productValidator");
class ProductController {
  static getProducts = async (req, res, next) => {
    try {
      const products = await ProductService.getProducts(
        // req.user.id,
        req.query.page,
        req.query.limit
      );
      res.status(200).json({
        message: "Lấy tất cả sản phẩm thành công",
        success: true,
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };
  static getAddressShop = async (req, res, next) => {
    try {
      const products = await ProductService.getAddressShopProduct();
      res.status(200).json({
        message: "Lấy tất cả sản phẩm thành công",
        success: true,
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };
  static getProductShop = async (req, res) => {
    try {
      const response = await ProductService.getProductShop(
        req.user.id,
        req.query.page,
        req.query.limit
      );
      res.status(200).json({
        message: "Lấy sản phẩm của shop thành công",
        success: true,
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };
  static getProductShopByIdAccount = async (req, res) => {
    try {
      const response = await ProductService.getProductShop(
        req.params.id,
        req.query.page,
        req.query.limit
      );
      res.status(200).json({
        message: "Lấy sản phẩm của shop thành công",
        success: true,
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  static searchProducts = async (req, res) => {
    try {
      const { query, page, limit } = req.query;
      const products = await ProductService.searchProducts(query, page, limit);
      res.status(200).json({
        message: "Tìm kiếm sản phẩm thành công",
        success: true,
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        success: false,
      });
    }
  };
  static getProductsAll = async (req, res, next) => {
    try {
      const products = await ProductService.getProductsAll();
      res.status(200).json({
        message: "Lấy tất cả sản phẩm thành công",
        success: true,
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  };

  static getProductById = async (req, res) => {
    try {
      const product = await ProductService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      return res.status(200).json({
        message: "Lấy sản phẩm thành công",
        success: true,
        data: product,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  static getProductsByCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
      // console.log("Category ID:", categoryId);
      const products = await ProductService.getProductsByCategory(categoryId);
      if (!products || products.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy sản phẩm nào cho danh mục này" });
      }
      return res.status(200).json({
        message: "Lấy sản phẩm theo danh mục thành công",
        success: true,
        data: products,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  // tổng hợp
  static createProduct = async (req, res) => {
    try {
      // // Kiểm tra tính hợp lệ của dữ liệu đầu vào
      // const { error } = productSchema.validate(req.body);
      // if (error) {
      //   return res.status(400).json({ message: error.details[0].message });
      // }

      // Lấy dữ liệu từ body của request
      const {
        name,
        code,
        short_desc,
        desc_product,
        category_id,
        metadata, // Chúng ta sử dụng metadata dưới dạng mảng đối tượng { key, value }
        file_attachments,
        file_attachmentsdefault,
      } = req.body;

      // Gọi service để tạo sản phẩm mới
      const savedProduct = await ProductService.createProduct(
        name,
        code,
        short_desc,
        desc_product,
        category_id,
        metadata, // Truyền metadata trực tiếp
        file_attachments,
        file_attachmentsdefault,
        // number_inventory_product,
        // quantity_by_key_value,
        req.user.id
      );

      // Trả về kết quả thành công
      res.status(201).json({
        message: "Tạo sản phẩm thành công",
        success: true,
        product: savedProduct,
      });
    } catch (error) {
      // Trả về lỗi nếu có vấn đề xảy ra
      res.status(400).json({ error: error.message });
    }
  };
  static updateProduct = async (req, res) => {
    try {
      const savedProduct = await ProductService.updateProduct(
        req.params.id, // Thêm id vào đây
        req.user.id, // Thêm account_id nếu cần
        req.body.name,
        req.body.short_desc,
        req.body.desc_product,
        req.body.category_id,
        req.body.metadata
      );

      res.status(200).json({
        message: "Cập nhật sản phẩm thành công",
        success: true,
        product: savedProduct,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  static createProductPhone = async (req, res) => {
    try {
      const { error } = productSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }
      const {
        name,
        code,
        short_desc,
        desc_product,
        category_id,
        memory,
        color,
        file_attachments,
        file_attachmentsdefault,
        quantity_by_key_value,
      } = req.body;
      const metadata = {
        memorys: memory,
        colors: color,
      };
      const savedProduct = await ProductService.createProductphone(
        name,
        code,
        short_desc,
        desc_product,
        category_id,
        metadata,
        file_attachments,
        file_attachmentsdefault,
        req.user.id
      );
      res.status(201).json({
        message: "Tạo sản phẩm thành công",
        success: true,
        data: savedProduct,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  static deleteProduct = async (req, res) => {
    try {
      const deletedProduct = await ProductService.deleteProduct(req.params.id);
      if (!deletedProduct) {
        return res
          .status(404)
          .json({ message: "Xóa sản phẩm không thành công" });
      }
      return res.status(200).json({
        message: "Xóa sản phẩm thành công!",
        success: true,
        product: deletedProduct,
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  static getProductKeyValue = async (req, res) => {
    try {
      const response = await ProductService.getProductKeyValue(req.params.id);
      if (!response) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      return res.status(200).json({
        message: "Lấy thông tin sản phẩm thành công",
        success: true,
        data: response,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  static getTotalProductShop = async (req, res) => {
    try {
      const response = await ProductService.getTotalProductShop(req.params.id);
      res.status(200).json({
        message: "Lấy t��ng số sản phẩm trong shop thành công",
        success: true,
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        message: "lấy tổng số sản phẩm trong shop thất bại",
        success: false,
        error: error.message,
      });
    }
  };
  static getTotalProductShopper = async (req, res) => {
    try {
      const response = await ProductService.getTotalProductShop(req.user.id);
      res.status(200).json({
        message: "Lấy t��ng số sản phẩm trong shop thành công",
        success: true,
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        message: "lấy tổng số sản phẩm trong shop thất bại",
        success: false,
        error: error.message,
      });
    }
  };
  static deleteFileAttachment = async (req, res) => {
    try {
      const response = await ProductService.deleteFileAttachment(
        req.params.id,
        req.user.id,
        req.body.id_array
      );
      res.status(200).json({
        message: "Xóa file đính kèm thành công",
        success: true,
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        message: "Xóa file đính kèm thất bại",
        success: false,
        error: error.message,
      });
    }
  };
  static deleteFileAttachmentDefault = async (req, res) => {
    try {
      const response = await ProductService.deleteFileAttachmentDefault(
        req.params.id,
        req.user.id,
        req.body.id_array
      );
      res.status(200).json({
        message: "Xóa file đính kèm mặc đình thành công",
        success: true,
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        message: "Xóa file đính kèm mặc đ��nh thất bại",
        success: false,
        error: error.message,
      });
    }
  };
  static uploadFileAttachment = async (req, res) => {
    try {
      const response = await ProductService.addFileAttachments(
        req.params.id,
        req.user.id,
        req.body.file_url,
        req.body.file_type
      );
      res.status(200).json({
        message: "Tải file đính kèm thành công",
        success: true,
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        message: "Tải file đính kèm thất bại",
        success: false,
        error: error.message,
      });
    }
  };
  static uploadFileAttachmentDefault = async (req, res) => {
    try {
      const response = await ProductService.addFileAttachmentsDefault(
        req.params.id,
        req.user.id,
        req.body.file_url,
        req.body.file_type
      );
      res.status(200).json({
        message: "Tải file đính kèm thành công",
        success: true,
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        message: "Tải file đính kèm thất bại",
        success: false,
        error: error.message,
      });
    }
  };
}

module.exports = ProductController;
