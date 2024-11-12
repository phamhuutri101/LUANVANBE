const { number } = require("joi");
const CategoryModel = require("../models/category");
const { message } = require("../validation/addressValidator");
const ObjectId = require("mongoose").Types.ObjectId;
class categoryController {
  static getAllCategory = async (req, res) => {
    try {
      const Categorys = await CategoryModel.aggregate([
        {
          $lookup: {
            from: "type_products",
            localField: "TYPE_PRODUCT_ID",
            foreignField: "_id",
            as: "typeProductDetails",
          },
        },
      ]);

      res.status(200).json({
        message: "lấy danh mục sản phẩm thành công",
        success: true,
        data: Categorys,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  static getCategoryById = async (req, res) => {
    const ID = new ObjectId(req.params.id);
    try {
      const category = await CategoryModel.aggregate([
        {
          $match: {
            _id: ID,
          },
        },
        {
          $lookup: {
            from: "type_products", // tên bảng Mogdb
            localField: "TYPE_PRODUCT_ID", // bảng
            foreignField: "_id", // id
            as: "typeProductDetails", // tên tùy ý
          },
        },
      ]);
      if (!category) {
        return res.status(404).json({ message: "khong tim thay san pham" });
      }
      res.status(200).json({
        message: "tìm danh mục thành công",
        success: true,
        data: category,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  static createCategory = async (req, res) => {
    try {
      // console.log("id sản phẩm:", req.body.TYPE_PRODUCT_ID);
      const category = new CategoryModel(req.body);
      category.CREATED_AT = new Date();
      category.UPDATED_AT = null;
      await category.save();
      const savedCategory = await CategoryModel.aggregate([
        { $match: { _id: category._id } },
        {
          $lookup: {
            from: "type_products",
            localField: "TYPE_PRODUCT_ID",
            foreignField: "_id",
            as: "typeProductDetails",
          },
        },
      ]);

      res.status(201).json({
        message: "Tạo danh mục sản phẩm thành công",
        success: true,
        data: savedCategory[0],
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  static updateCategory = async (req, res) => {
    try {
      // Cập nhật tài liệu
      const updateCategory = await CategoryModel.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          UPDATED_AT: new Date(),
        },
        { new: true } // Trả về tài liệu mới sau khi cập nhật
      );

      if (!updateCategory) {
        return res.status(404).json({ message: "Cập nhật không thành công" });
      }

      // Sử dụng Aggregation và $lookup để lấy thông tin chi tiết
      const category = await CategoryModel.aggregate([
        {
          $match: {
            _id: new ObjectId(req.params.id),
          },
        },
        {
          $lookup: {
            from: "type_products", // Tên bảng mong
            localField: "TYPE_PRODUCT_ID", // bảng
            foreignField: "_id", // Trường
            as: "typeProductDetails", // Tên tùy ý muốn hiễn thị ra
          },
        },
      ]);

      if (!category || category.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy sản phẩm sau khi cập nhật" });
      }

      res.status(200).json({
        message: "Cập nhật sản phẩm thành công",
        category: category[0],
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  static deleteCategory = async (req, res) => {
    try {
      const category = await CategoryModel.findByIdAndDelete(req.params.id);
      if (!category) {
        return res.status(400).json({ message: "Xóa khong thanh cong" });
      }
      return res.status(200).json({
        message: "Xoa sản phẫm thành công!",
        category: category, // trả về dl vừa xóa
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  // Hàm lấy tất cả danh mục có sản phẩm được đăng của shop
  static getCategoriesWithProducts = async (req, res) => {
    try {
      const categoriesWithProducts = await CategoryModel.aggregate([
        {
          $lookup: {
            from: "products", // tên collection của sản phẩm
            localField: "_id", // liên kết từ trường _id của category
            foreignField: "CATEGORY_ID", // liên kết đến trường CATEGORY_ID của sản phẩm
            as: "products",
          },
        },
        {
          $match: {
            "products.ACCOUNT__ID": req.body.id_account, // chỉ lấy sản phẩm của shop có ACCOUNT__ID trùng với accountId
            "products.IS_DELETED": false, // chỉ lấy các sản phẩm chưa bị xóa
          },
        },
        {
          $project: {
            CATEGORY_NAME: 1,
            CREATED_AT: 1,
            UPDATED_AT: 1,
            TYPE_PRODUCT_ID: 1,
            products: {
              NAME_PRODUCT: 1,
              SHORT_DESC: 1,
              NUMBER_INVENTORY_PRODUCT: 1,
            },
          },
        },
      ]);

      res.status(200).json({
        message: "Lấy danh sách danh mục thành công",
        success: true,
        data: categoriesWithProducts,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}

module.exports = categoryController;
