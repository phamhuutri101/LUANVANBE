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
  static getInventory_Entries = async () => {
    const getInventory_Entries = await inventory_entriesModel.find();
    return getInventory_Entries;
  };

  static getInventory_EntriesById = async (id) => {
    const getInventory_Entries = await inventory_entriesModel.findById(id);
    return getInventory_Entries;
  };

  static updateInventory_Entries = async (id, payload) => {};

  static deleteInventory_Entries = async (id) => {};
}

module.exports = Inventory_EntriesService;
