const TypeProductModel = require("../models/list_type_product");
const CategoryModel = require("../models/category");
const ObjectId = require("mongoose").Types.ObjectId;
class TypeProduct {
  static createTypeProduct = async (name_type, avt_url) => {
    const response = await TypeProductModel.create({
      TYPE_PRODUCT: name_type,
      CREATED_AT: new Date(),
      UPDATED_AT: null,
      IS_DELETED: false,
      ATV_URL: avt_url,
    });
    return response;
  };
  static getAllTypeProducts = async () => {
    const response = await TypeProductModel.find({ IS_DELETED: false });
    return response;
  };
  static getCategoriesByTypeProduct = async (typeProductId) => {
    const TYPE_PRODUCT_ID = new ObjectId(typeProductId);
    try {
      const categories = await CategoryModel.aggregate([
        {
          $match: {
            TYPE_PRODUCT_ID: TYPE_PRODUCT_ID, // Lọc theo ID của list_type_product
          },
        },
        {
          $lookup: {
            from: "list_type_products", // Tên collection của bảng list_type_product
            localField: "TYPE_PRODUCT_ID", // Trường trong bảng category để nối
            foreignField: "_id", // Trường trong bảng list_type_product để nối
            as: "typeProduct", // Kết quả sẽ được lưu vào mảng typeProduct
          },
        },
      ]);

      return categories;
    } catch (error) {
      console.error(error);
      throw new Error("Có lỗi xảy ra khi lấy danh mục sản phẩm.");
    }
  };
  static getProductCategoriesByTypeProduct = async (typeProductId) => {
    const TYPE_PRODUCT_ID = new ObjectId(typeProductId);

    try {
      const categoriesWithProducts = await CategoryModel.aggregate([
        {
          $match: {
            TYPE_PRODUCT_ID: TYPE_PRODUCT_ID, // Lọc các danh mục theo typeProductId
          },
        },
        {
          $lookup: {
            from: "products", // Tên collection của bảng product
            localField: "_id", // Trường `_id` trong bảng category
            foreignField: "CATEGORY_ID", // Trường CATEGORY_ID trong bảng product
            as: "products", // Kết quả sẽ được lưu vào mảng `products`
          },
        },
        {
          $unwind: {
            path: "$products", // Giải nén mảng `products` để xử lý từng sản phẩm
            preserveNullAndEmptyArrays: true, // Giữ danh mục nếu không có sản phẩm
          },
        },
        {
          $lookup: {
            from: "list_type_products", // Tên collection của bảng list_type_product
            localField: "TYPE_PRODUCT_ID", // Trường TYPE_PRODUCT_ID trong bảng category
            foreignField: "_id", // Trường `_id` trong bảng list_type_product
            as: "typeProduct", // Kết quả sẽ được lưu vào mảng `typeProduct`
          },
        },
        {
          $unwind: "$typeProduct", // Giải nén mảng typeProduct
        },
        {
          $group: {
            _id: "$_id", // Nhóm theo danh mục (category)
            CATEGORY_NAME: { $first: "$CATEGORY_NAME" }, // Lấy tên danh mục
            TYPE_PRODUCT: { $first: "$typeProduct.TYPE_PRODUCT" }, // Lấy tên loại sản phẩm
            products: { $push: "$products" }, // Gom tất cả các sản phẩm
          },
        },
        {
          $project: {
            _id: 1,
            CATEGORY_NAME: 1,
            TYPE_PRODUCT: 1,
            products: 1, // Hiển thị sản phẩm trong từng danh mục
          },
        },
      ]);

      return categoriesWithProducts;
    } catch (error) {
      console.error(error);
      throw new Error("Có lỗi xảy ra khi lấy sản phẩm theo danh mục.");
    }
  };
}
module.exports = TypeProduct;
