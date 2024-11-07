const { response } = require("express");
const account = require("../models/account");
const inventory_entriesModel = require("../models/inventory_entries");
const ProductModel = require("../models/product");
const ObjectId = require("mongoose").Types.ObjectId;

class Inventory_EntriesService {
  static addInventory_Entries = async (
    id_product,
    price,
    quantity,
    key,
    value,
    id_supplier,
    account_id
  ) => {
    let details = [];
    if (
      Array.isArray(key) &&
      Array.isArray(value) &&
      key.length === value.length
    ) {
      for (let i = 0; i < key.length; i++) {
        details.push({
          KEY: key[i],
          VALUE: value[i],
        });
      }
    }
    const newInventory_Entries = await inventory_entriesModel.create({
      LIST_PRODUCT_CREATED: {
        ID_PRODUCT: id_product,
        UNIT_PRICE: price,
        QUANTITY: quantity,
        DETAILS: details,
        TOTAL_IMPORT_CONST: price * quantity,
      },
      CRATED_DATE: new Date(),
      ID_SUPPLIERS: id_supplier,
      ACCOUNT__ID: account_id,
    });
    return newInventory_Entries;
  };

  static updateInventoryProduct = async (
    id_product,
    keys,
    values,
    quantity
  ) => {
    const ID = new ObjectId(id_product);

    // Tạo một đối tượng điều kiện duy nhất để sử dụng với $elemMatch
    let matchCondition = {
      $and: keys.map((key, index) => ({
        "LIST_MATCH_KEY.KEY": key,
        "LIST_MATCH_KEY.VALUE": values[index],
      })),
    };

    const updateQuantity = await ProductModel.findOneAndUpdate(
      {
        _id: ID,
        QUANTITY_BY_KEY_VALUE: {
          $elemMatch: matchCondition,
        },
      },
      {
        $inc: {
          "QUANTITY_BY_KEY_VALUE.$.QUANTITY": quantity,
        },
      },
      { new: true, runValidators: true }
    );
    if (!updateQuantity) {
      let LIST_MATCH_KEY = keys.map((key, index) => ({
        KEY: key,
        VALUE: values[index],
      }));
      const product = await ProductModel.updateOne(
        {
          _id: ID,
        },
        {
          $push: {
            QUANTITY_BY_KEY_VALUE: {
              QUANTITY: quantity,
              LIST_MATCH_KEY: LIST_MATCH_KEY,
            },
          },
        },
        { new: true, runValidators: true }
      );
    }

    return updateQuantity;
  };
  static updateNumberInventoryProduct = async (id_product) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const product = await ProductModel.findById(ID_PRODUCT);
    if (!product) {
      throw new Error("Product not found");
    }
    let totalQuantity = 0;
    product.QUANTITY_BY_KEY_VALUE.forEach((item) => {
      totalQuantity = totalQuantity + item.QUANTITY;
    });
    product.NUMBER_INVENTORY_PRODUCT = totalQuantity;
    product.save();
    return product;
  };
  static deleteInventoryEntry = async (inventoryEntryId, accountId) => {
    const InventoryId = new ObjectId(inventoryEntryId);
    const ACCOUNT_ID = new ObjectId(accountId);
    console.log(InventoryId);
    console.log(ACCOUNT_ID);
    try {
      // Tìm phiếu nhập kho cần xóa
      const inventoryEntry = await inventory_entriesModel.findOne({
        _id: inventoryEntryId,
        ACCOUNT__ID: ACCOUNT_ID,
        IS_DELETE: false,
      });

      if (!inventoryEntry) {
        throw new Error("Không tìm thấy phiếu nhập kho");
      }

      // Lấy thông tin sản phẩm trong phiếu nhập
      const productCreated = inventoryEntry.LIST_PRODUCT_CREATED[0];
      if (!productCreated) {
        throw new Error("Phiếu nhập không có thông tin sản phẩm");
      }

      // Tìm sản phẩm cần cập nhật số lượng
      const product = await ProductModel.findOne({
        _id: productCreated.ID_PRODUCT,
        ACCOUNT__ID: accountId,
        IS_DELETED: false,
      });

      if (!product) {
        throw new Error("Không tìm thấy sản phẩm");
      }

      // Giảm số lượng tồn kho chính
      const newInventory =
        product.NUMBER_INVENTORY_PRODUCT - productCreated.QUANTITY;
      if (newInventory < 0) {
        throw new Error("Số lượng tồn kho không đủ để xóa");
      }

      // Nếu có chi tiết thuộc tính, cập nhật QUANTITY_BY_KEY_VALUE
      if (productCreated.DETAILS && productCreated.DETAILS.length > 0) {
        // Tạo map các cặp key-value từ details
        const detailMap = new Map();
        productCreated.DETAILS.forEach((detail) => {
          detailMap.set(detail.KEY, detail.VALUE);
        });

        // Cập nhật số lượng trong QUANTITY_BY_KEY_VALUE
        product.QUANTITY_BY_KEY_VALUE.forEach((qtyItem) => {
          let isMatch = true;
          qtyItem.LIST_MATCH_KEY.forEach((matchKey) => {
            if (detailMap.get(matchKey.KEY) !== matchKey.VALUE[0]) {
              isMatch = false;
            }
          });

          if (isMatch) {
            qtyItem.QUANTITY -= productCreated.QUANTITY;
            if (qtyItem.QUANTITY < 0) {
              throw new Error("Số lượng theo thuộc tính không đủ để xóa");
            }
          }
        });
      }

      // Cập nhật sản phẩm
      product.NUMBER_INVENTORY_PRODUCT = newInventory;
      await product.save();

      // Đánh dấu phiếu nhập đã xóa
      inventoryEntry.IS_DELETE = true;
      await inventoryEntry.save();

      return {
        message: "Xóa phiếu nhập kho thành công",
        inventoryEntry,
        product,
      };
    } catch (error) {
      throw error;
    }
  };

  static getInventory_Entries = async (id_account) => {
    const ID_ACCOUNT = new ObjectId(id_account);
    const getInventory_Entries = await inventory_entriesModel.find({
      ACCOUNT__ID: ID_ACCOUNT,
      IS_DELETE: false,
    });
    return getInventory_Entries;
  };
  static getInventoryByIdProduct = async (id_product, id_account) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const ID_ACCOUNT = new ObjectId(id_account);
    const response = await inventory_entriesModel.aggregate([
      {
        $match: {
          ACCOUNT__ID: ID_ACCOUNT,
          IS_DELETE: false,
          LIST_PRODUCT_CREATED: { $elemMatch: { ID_PRODUCT: ID_PRODUCT } },
        },
      },
    ]);
    return response;
  };
  static getInventory_EntriesById = async (id, id_account) => {
    const ID = new ObjectId(id);
    const ID_ACCOUNT = new ObjectId(id_account);
    const getInventory_Entries = await inventory_entriesModel.findOne({
      _id: ID,
      ACCOUNT__ID: ID_ACCOUNT,
    });
    return getInventory_Entries;
  };

  static updateInventory_Entries = async (id, payload) => {};

  static deleteInventory_Entries = async (id) => {
    const deleteInventory_Entries = await inventory_entriesModel
      .findOne({ _id: id })
      .exec();
    return deleteInventory_Entries;
  };
}

module.exports = Inventory_EntriesService;
