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

  static async createProductFashion(
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
    const { colors, sizes } = metadata;
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
    const product = await ProductModel.create({
      NAME_PRODUCT: name,
      CODE_PRODUCT: code,
      SHORT_DESC: short_desc,
      DESC_PRODUCT: desc_product,
      // NUMBER_INVENTORY_PRODUCT: ,
      CREATED_AT: new Date(),
      UPDATED_AT: null,
      CATEGORY_ID: CATEGORY_ID,
      LIST_PRODUCT_METADATA: [
        {
          KEY: "Màu Sắc",
          VALUE: colors,
        },
        {
          KEY: "Kích Thước",
          VALUE: sizes,
        },
      ],
      LIST_FILE_ATTACHMENT: listFileAttachments,
      ACCOUNT__ID: ACCOUNT__ID,
      LIST_FILE_ATTACHMENT_DEFAULT: listFileAttachmentsdefault,
      // QUANTITY_BY_KEY_VALUE: quantityByKeyValue,
    });
    return product;
  }
  static async createProductfood(
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
    const { sizes, types } = metadata;
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
    const product = await ProductModel.create({
      NAME_PRODUCT: name,
      CODE_PRODUCT: code,
      SHORT_DESC: short_desc,
      DESC_PRODUCT: desc_product,
      // NUMBER_INVENTORY_PRODUCT: quantity,
      CREATED_AT: new Date(),
      UPDATED_AT: null,
      CATEGORY_ID: CATEGORY_ID,
      LIST_PRODUCT_METADATA: [
        {
          KEY: "Kích Cỡ",
          VALUE: sizes,
        },
        {
          KEY: "Loại",
          VALUE: types,
        },
      ],
      LIST_FILE_ATTACHMENT: listFileAttachments,
      ACCOUNT__ID: ACCOUNT__ID,
      LIST_FILE_ATTACHMENT_DEFAULT: listFileAttachmentsdefault,
      // QUANTITY_BY_KEY_VALUE: quantityByKeyValue,
    });
    return product;
  }
  static async createProductphone(
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
    const { memorys, colors } = metadata;
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
    const product = await ProductModel.create({
      NAME_PRODUCT: name,
      CODE_PRODUCT: code,
      SHORT_DESC: short_desc,
      DESC_PRODUCT: desc_product,
      // NUMBER_INVENTORY_PRODUCT: number_inventory_product,
      CREATED_AT: new Date(),
      UPDATED_AT: null,
      CATEGORY_ID: CATEGORY_ID,
      LIST_PRODUCT_METADATA: [
        {
          KEY: "Bộ Nhớ",
          VALUE: memorys,
        },
        {
          KEY: "Màu Sắc",
          VALUE: colors,
        },
      ],

      LIST_FILE_ATTACHMENT: listFileAttachments,
      // QUANTITY_BY_KEY_VALUE: quantityByKeyValue,
      LIST_FILE_ATTACHMENT_DEFAULT: listFileAttachmentsdefault,
      ACCOUNT__ID: ACCOUNT__ID,
    });
    return product;
  }
  static async createProductEarphone(
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
    const { memorys, colors } = metadata;
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
    const product = await ProductModel.create({
      NAME_PRODUCT: name,
      CODE_PRODUCT: code,
      SHORT_DESC: short_desc,
      DESC_PRODUCT: desc_product,
      // NUMBER_INVENTORY_PRODUCT: number_inventory_product,
      CREATED_AT: new Date(),
      UPDATED_AT: null,
      CATEGORY_ID: CATEGORY_ID,
      LIST_PRODUCT_METADATA: [
        {
          KEY: "Bộ Nhớ",
          VALUE: memorys,
        },
        {
          KEY: "Màu Sắc",
          VALUE: colors,
        },
      ],

      LIST_FILE_ATTACHMENT: listFileAttachments,
      // QUANTITY_BY_KEY_VALUE: quantityByKeyValue,
      LIST_FILE_ATTACHMENT_DEFAULT: listFileAttachmentsdefault,
      ACCOUNT__ID: ACCOUNT__ID,
    });
    return product;
  }

  static async updateProduct(
    name,
    code,
    short_desc,
    desc_product,
    number_inventory_product,
    category_id,
    metadata,
    file_attachments,
    quantity_by_key_value,
    account_id
  ) {
    const ID = new ObjectId(id_product);
    const ACCOUNT__ID = new ObjectId(account_id);
    const CATEGORY_ID = new ObjectId(category_id);

    const listFileAttachments = file_attachments.map((file) => ({
      FILE_URL: file.file_url,
      FILE_TYPE: file.file_type,
      FROM_DATE: new Date(),
      TO_DATE: null,
    }));
    const quantityByKeyValue = quantity_by_key_value.map((item) => ({
      QUANTITY: item.quantity,
      LIST_MATCH_KEY: item.list_match_key.map((match) => ({
        KEY: match.key,
        VALUE: match.value,
      })),
    }));
    const updateProduct = await ProductModel.updateOne(
      {
        ACCOUNT__ID: ACCOUNT__ID,
      },
      {
        $set: {
          NAME_PRODUCT: name,
          CODE_PRODUCT: code,
          SHORT_DESC: short_desc,
          DESC_PRODUCT: desc_product,
          NUMBER_INVENTORY_PRODUCT: number_inventory_product,
          CREATED_AT: new Date(),
          UPDATED_AT: new Date(),
          CATEGORY_ID: CATEGORY_ID,
        },
        $push: {
          LIST_PRODUCT_METADATA: {
            KEY: key,
            VALUE: value,
          },
          LIST_FILE_ATTACHMENT: {
            $each: listFileAttachments,
          },
          QUANTITY_BY_KEY_VALUE: {
            $each: quantityByKeyValue,
          },
        },
      }
    );
    return updateProduct;
  }

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
}

module.exports = ProductService;
