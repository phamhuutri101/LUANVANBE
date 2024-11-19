const ProductModel = require("../models/product");
const ObjectId = require("mongoose").Types.ObjectId;
class ProductService {
  static getProducts = async (page = 1, limit = 10) => {
    page = Number(page);
    limit = Number(limit);
    const getProduct = await ProductModel.aggregate([
      {
        $match: {
          IS_DELETED: false,
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          IS_DELETED: 0,
        },
      },
    ]);
    return getProduct;
  };
  static getAddressShopProduct = async () => {
    try {
      const products = await ProductModel.aggregate([
        {
          $match: {
            IS_DELETED: false,
          },
        },
        {
          $lookup: {
            from: "accounts",
            localField: "ACCOUNT__ID",
            foreignField: "_id",
            as: "account",
          },
        },
        {
          $unwind: "$account",
        },
        {
          $lookup: {
            from: "users",
            localField: "account.USER_ID",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $lookup: {
            from: "user_addresses",
            let: { userId: "$user._id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$USER_ID", "$$userId"] } } },
              {
                $project: {
                  LIST_ADDRESS: {
                    $filter: {
                      input: "$LIST_ADDRESS",
                      as: "address",
                      cond: { $eq: ["$$address.IS_DEFAULT", true] },
                    },
                  },
                },
              },
            ],
            as: "user_addresses",
          },
        },
        {
          $unwind: "$user_addresses",
        },
        {
          $project: {
            NAME_PRODUCT: 1,
            SHORT_DESC: 1,
            DESC_PRODUCT: 1,
            "user_addresses.LIST_ADDRESS": 1, // Lấy danh sách địa chỉ từ `user_addresses`
          },
        },
      ]);

      // Tạo mảng lưu địa chỉ duy nhất theo PROVINCE
      const uniqueAddresses = [];
      const addressMap = new Map();

      products.forEach((product) => {
        if (product.user_addresses && product.user_addresses.LIST_ADDRESS) {
          const defaultAddresses = product.user_addresses.LIST_ADDRESS.filter(
            (address) => address.IS_DEFAULT === true
          );

          defaultAddresses.forEach((address) => {
            const provinceKey = address.PROVINCE;
            if (!addressMap.has(provinceKey)) {
              addressMap.set(provinceKey, address);
              uniqueAddresses.push(address);
            }
          });
        }
      });

      return uniqueAddresses;
    } catch (error) {
      console.error("Error fetching product with address:", error);
      throw error;
    }
  };

  static getProductShop = async (id_account, page = 1, limit = 10) => {
    page = Number(page);
    limit = Number(limit);
    const ID_ACCOUNT = new ObjectId(id_account);
    const getProduct = await ProductModel.aggregate([
      {
        $match: {
          IS_DELETED: false,
          ACCOUNT__ID: ID_ACCOUNT,
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          IS_DELETED: 0,
        },
      },
    ]);
    return getProduct;
  };

  static getTotalProductShop = async (id_account) => {
    const ID_ACCOUNT = new ObjectId(id_account);
    const getProduct = await ProductModel.aggregate([
      {
        $match: {
          IS_DELETED: false,
          ACCOUNT__ID: ID_ACCOUNT,
        },
      },

      {
        $project: {
          IS_DELETED: 0,
        },
      },
    ]);
    return getProduct.length;
  };

  static getProductsAll = async () => {
    const getProduct = await ProductModel.aggregate([
      {
        $match: {
          IS_DELETED: false,
        },
      },
      {
        $project: {
          IS_DELETED: 0,
        },
      },
    ]);
    return getProduct;
  };

  static async searchProducts(searchQuery, page = 1, limit = 10) {
    page = Number(page);
    limit = Number(limit);

    const query = {
      $text: { $search: searchQuery },
      IS_DELETED: false,
    };

    try {
      const products = await ProductModel.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-IS_DELETED");

      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  static async getProductById(id) {
    return await ProductModel.findById(id);
  }
  static getProductsByCategory = async (id) => {
    const CATEGORY_ID = new ObjectId(id);
    const products = await ProductModel.aggregate([
      {
        $match: {
          CATEGORY_ID: CATEGORY_ID,
          IS_DELETED: false,
        },
      },
    ]);
    return products;
  };
  static async createProduct(
    name,
    code,
    short_desc,
    desc_product,
    category_id,
    metadata,
    file_attachments,
    file_attachmentsdefault,
    account_id
  ) {
    const ACCOUNT__ID = new ObjectId(account_id);
    const CATEGORY_ID = new ObjectId(category_id);

    // Xử lý file đính kèm
    const listFileAttachments = file_attachments.map((file) => ({
      FILE_URL: file.file_url,
      FILE_TYPE: file.file_type,
      FROM_DATE: new Date(),
      TO_DATE: null,
    }));

    const listFileAttachmentsdefault = file_attachmentsdefault.map((file) => ({
      FILE_URL: file.file_url,
      FILE_TYPE: file.file_type,
      FROM_DATE: new Date(),
      TO_DATE: null,
    }));
    // Tạo danh sách metadata từ input truyền vào
    const listProductMetadata = metadata.map((item) => ({
      KEY: item.key, // KEY được truyền từ tham số
      VALUE: item.value, // VALUE được truyền từ tham số
    }));

    // Tạo sản phẩm
    const product = await ProductModel.create({
      NAME_PRODUCT: name,
      CODE_PRODUCT: code,
      SHORT_DESC: short_desc,
      DESC_PRODUCT: desc_product,
      CREATED_AT: new Date(),
      UPDATED_AT: null,
      CATEGORY_ID: CATEGORY_ID,
      LIST_PRODUCT_METADATA: listProductMetadata, // Đã thay đổi
      LIST_FILE_ATTACHMENT: listFileAttachments,
      ACCOUNT__ID: ACCOUNT__ID,
      LIST_FILE_ATTACHMENT_DEFAULT: listFileAttachmentsdefault,
      // QUANTITY_BY_KEY_VALUE: quantityByKeyValue,
    });

    return product;
  }
  static async updateProduct(
    id_product,
    id_account,
    name,
    short_desc,
    desc_product,
    category_id,
    metadata
  ) {
    const ID_PRODUCT = new ObjectId(id_product);
    const ID_ACCOUNT = new ObjectId(id_account);
    const CATEGORY_ID = new ObjectId(category_id);
    try {
      // Tạo danh sách metadata từ input truyền vào (nếu có)
      const listProductMetadata = metadata
        ? metadata.map((item) => ({
            KEY: item.KEY, // Lấy đúng KEY từ dữ liệu
            VALUE: item.VALUE, // Lấy đúng VALUE từ dữ liệu
          }))
        : undefined;

      // Tạo đối tượng cập nhật
      const fieldsToUpdate = {
        UPDATED_AT: new Date(), // Thời gian cập nhật
      };
      if (name) fieldsToUpdate.NAME_PRODUCT = name;
      if (short_desc) fieldsToUpdate.SHORT_DESC = short_desc;
      if (desc_product) fieldsToUpdate.DESC_PRODUCT = desc_product;
      if (CATEGORY_ID) fieldsToUpdate.CATEGORY_ID = CATEGORY_ID;
      if (listProductMetadata)
        fieldsToUpdate.LIST_PRODUCT_METADATA = listProductMetadata;
      // Thực hiện cập nhật
      const updatedProduct = await ProductModel.findOneAndUpdate(
        { _id: ID_PRODUCT, IS_DELETED: false, ACCOUNT__ID: ID_ACCOUNT }, // Điều kiện tìm kiếm
        { $set: fieldsToUpdate }, // Cập nhật các trường
        { new: true } // Trả về sản phẩm sau khi cập nhật
      );

      if (!updatedProduct) {
        throw new Error("Không tìm thấy sản phẩm hoặc sản phẩm đã bị xóa.");
      }

      return updatedProduct;
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error);
      throw new Error(error.message || "Không thể cập nhật sản phẩm.");
    }
  }

  // static async updateProduct(
  //   name,
  //   code,
  //   short_desc,
  //   desc_product,
  //   number_inventory_product,
  //   category_id,
  //   metadata,
  //   file_attachments,
  //   quantity_by_key_value,
  //   account_id
  // ) {
  //   const ID = new ObjectId(id_product);
  //   const ACCOUNT__ID = new ObjectId(account_id);
  //   const CATEGORY_ID = new ObjectId(category_id);

  //   const listFileAttachments = file_attachments.map((file) => ({
  //     FILE_URL: file.file_url,
  //     FILE_TYPE: file.file_type,
  //     FROM_DATE: new Date(),
  //     TO_DATE: null,
  //   }));
  //   const quantityByKeyValue = quantity_by_key_value.map((item) => ({
  //     QUANTITY: item.quantity,
  //     LIST_MATCH_KEY: item.list_match_key.map((match) => ({
  //       KEY: match.key,
  //       VALUE: match.value,
  //     })),
  //   }));
  //   const updateProduct = await ProductModel.updateOne(
  //     {
  //       ACCOUNT__ID: ACCOUNT__ID,
  //     },
  //     {
  //       $set: {
  //         NAME_PRODUCT: name,
  //         CODE_PRODUCT: code,
  //         SHORT_DESC: short_desc,
  //         DESC_PRODUCT: desc_product,
  //         NUMBER_INVENTORY_PRODUCT: number_inventory_product,
  //         CREATED_AT: new Date(),
  //         UPDATED_AT: new Date(),
  //         CATEGORY_ID: CATEGORY_ID,
  //       },
  //       $push: {
  //         LIST_PRODUCT_METADATA: {
  //           KEY: key,
  //           VALUE: value,
  //         },
  //         LIST_FILE_ATTACHMENT: {
  //           $each: listFileAttachments,
  //         },
  //         QUANTITY_BY_KEY_VALUE: {
  //           $each: quantityByKeyValue,
  //         },
  //       },
  //     }
  //   );
  //   return updateProduct;
  // }

  static deleteProduct = async (id_product) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const deletedProduct = await ProductModel.updateOne(
      { _id: ID_PRODUCT },
      {
        $set: {
          IS_DELETED: true,
        },
      }
    );

    return { deletedProduct };
  };
  static getProductKeyValue = async (id_product) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const result = await ProductModel.aggregate([
      { $match: { _id: ID_PRODUCT, IS_DELETED: false } },
      { $unwind: "$QUANTITY_BY_KEY_VALUE" },
      { $unwind: "$QUANTITY_BY_KEY_VALUE.LIST_MATCH_KEY" }, // Tháo dỡ LIST_MATCH_KEY
      {
        $group: {
          _id: "$QUANTITY_BY_KEY_VALUE.LIST_MATCH_KEY.KEY",
          VALUE: { $addToSet: "$QUANTITY_BY_KEY_VALUE.LIST_MATCH_KEY.VALUE" }, // Gộp VALUE
        },
      },
      {
        $project: {
          KEY: "$_id",
          VALUE: 1,
          _id: { $concat: ["ID_", { $toString: "$$ROOT._id" }] }, // Tạo _id mới nếu cần
        },
      },
      {
        $group: {
          _id: null,
          LIST_PRODUCT_METADATA: {
            $push: { KEY: "$KEY", VALUE: "$VALUE", _id: "$_id" },
          }, // Tạo danh sách cuối cùng
        },
      },
      { $project: { _id: 0, LIST_PRODUCT_METADATA: 1 } }, // Chỉ giữ lại danh sách
    ]);

    return result.length > 0 ? result[0] : null; // Trả về kết quả
  };
  static deleteFileAttachment = async (
    id_product,
    id_account,
    id_attachment
  ) => {
    try {
      const ID_PRODUCT = new ObjectId(id_product);
      const ID_ACCOUNT = new ObjectId(id_account);
      const ID_ATTACHMENT = new ObjectId(id_attachment);

      // Thực hiện cập nhật để xóa phần tử trong mảng LIST_FILE_ATTACHMENT
      const updatedProduct = await ProductModel.updateOne(
        {
          _id: ID_PRODUCT,
          ACCOUNT__ID: ID_ACCOUNT,
        },
        {
          $pull: {
            LIST_FILE_ATTACHMENT: { _id: ID_ATTACHMENT },
          },
        }
      );

      if (updatedProduct.modifiedCount === 0) {
        return {
          success: false,
          message: "Không tìm thấy sản phẩm hoặc không có tệp cần xóa.",
        };
      }

      return {
        success: true,
        message: "Đã xóa tệp thành công.",
        updatedProduct,
      };
    } catch (error) {
      console.error("Error deleting file attachment:", error);
      return { success: false, message: "Đã xảy ra lỗi khi xóa tệp.", error };
    }
  };
  static deleteFileAttachmentDefault = async (
    id_product,
    id_account,
    id_attachment
  ) => {
    try {
      const ID_PRODUCT = new ObjectId(id_product);
      const ID_ACCOUNT = new ObjectId(id_account);
      const ID_ATTACHMENT = new ObjectId(id_attachment);

      // Thực hiện cập nhật để xóa phần tử trong mảng LIST_FILE_ATTACHMENT
      const updatedProduct = await ProductModel.updateOne(
        {
          _id: ID_PRODUCT,
          ACCOUNT__ID: ID_ACCOUNT,
        },
        {
          $pull: {
            LIST_FILE_ATTACHMENT_DEFAULT: { _id: ID_ATTACHMENT },
          },
        }
      );

      if (updatedProduct.modifiedCount === 0) {
        return {
          success: false,
          message: "Không tìm thấy sản phẩm hoặc không có tệp cần xóa.",
        };
      }

      return {
        success: true,
        message: "Đã xóa tệp thành công.",
        updatedProduct,
      };
    } catch (error) {
      console.error("Error deleting file attachment:", error);
      return { success: false, message: "Đã xảy ra lỗi khi xóa tệp.", error };
    }
  };
  static addFileAttachments = async (
    id_product,
    id_account,
    file_url,
    file_type
  ) => {
    try {
      const ID_PRODUCT = new ObjectId(id_product);
      const ID_ACCOUNT = new ObjectId(id_account);

      // Thực hiện cập nhật để thêm mảng hình ảnh vào LIST_FILE_ATTACHMENT
      const updatedProduct = await ProductModel.updateOne(
        {
          _id: ID_PRODUCT,
          ACCOUNT__ID: ID_ACCOUNT,
        },
        {
          $push: {
            LIST_FILE_ATTACHMENT: {
              FILE_URL: file_url,
              FILE_TYPE: file_type,
              FROM_DATE: new Date(),
              TO_DATE: null,
            },
          },
        }
      );

      if (updatedProduct.modifiedCount === 0) {
        return {
          success: false,
          message: "Không tìm thấy sản phẩm hoặc không thể thêm hình ảnh.",
        };
      }

      return {
        success: true,
        message: "Đã thêm hình ảnh thành công.",
        updatedProduct,
      };
    } catch (error) {
      console.error("Error adding file attachments:", error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi thêm hình ảnh.",
        error,
      };
    }
  };
  static addFileAttachmentsDefault = async (
    id_product,
    id_account,
    file_url,
    file_type
  ) => {
    try {
      const ID_PRODUCT = new ObjectId(id_product);
      const ID_ACCOUNT = new ObjectId(id_account);

      // Thực hiện cập nhật để thêm mảng hình ảnh vào LIST_FILE_ATTACHMENT
      const updatedProduct = await ProductModel.updateOne(
        {
          _id: ID_PRODUCT,
          ACCOUNT__ID: ID_ACCOUNT,
        },
        {
          $push: {
            LIST_FILE_ATTACHMENT_DEFAULT: {
              FILE_URL: file_url,
              FILE_TYPE: file_type,
              FROM_DATE: new Date(),
              TO_DATE: null,
            },
          },
        }
      );

      if (updatedProduct.modifiedCount === 0) {
        return {
          success: false,
          message: "Không tìm thấy sản phẩm hoặc không thể thêm hình ảnh.",
        };
      }

      return {
        success: true,
        message: "Đã thêm hình ảnh thành công.",
        updatedProduct,
      };
    } catch (error) {
      console.error("Error adding file attachments:", error);
      return {
        success: false,
        message: "Đã xảy ra lỗi khi thêm hình ảnh.",
        error,
      };
    }
  };
}
module.exports = ProductService;
