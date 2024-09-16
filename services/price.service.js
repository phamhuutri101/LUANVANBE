const PriceModel = require("../models/price");
const ObjectId = require("mongoose").Types.ObjectId;
class PriceService {
  static addPrice = async (id_product, price_number, key, value) => {
    const ID_PRODUCT = new ObjectId(id_product);
    let listMatchKeys = [];
    if (
      Array.isArray(key) &&
      Array.isArray(value) &&
      key.length == value.length
    ) {
      for (let i = 0; i < key.length; i++) {
        listMatchKeys.push({
          KEY: key[i],
          VALUE: value[i],
        });
      }
    }
    const addPrice = await PriceModel.updateOne(
      {
        ID_PRODUCT: ID_PRODUCT,
        LIST_PRICE_MAX_NUMBER: {
          $lt: 100,
        },
      },
      {
        $push: {
          LIST_PRICE: {
            PRICE_NUMBER: price_number,
            FROM_DATE: new Date(),
            TO_DATE: null,
            LIST_MATCH_KEY: listMatchKeys,
          },
        },
        $inc: {
          LIST_PRICE_MAX_NUMBER: 1,
        },
      },
      {
        upsert: true,
      }
    );
    return addPrice;
  };
  static getPrice = async (id_product) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const getALLPrice = PriceModel.aggregate([
      {
        $match: {
          ID_PRODUCT: ID_PRODUCT,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "ID_PRODUCT",
          foreignField: "_id",
          as: "PRODUCT",
        },
      },
      {
        $unwind: {
          path: "$PRODUCT",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$ID_PRODUCT",
          PRODUCT: {
            $addToSet: "$PRODUCT",
          },
          LIST_PRICE: {
            $push: "$LIST_PRICE",
          },
        },
      },
    ]);
    return getALLPrice;
  };
  static updatePrice = async (id_product, id_list_price, price_number) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const ID_LIST_PRICE = new ObjectId(id_list_price);
    const update = await PriceModel.updateOne(
      {
        ID_PRODUCT: ID_PRODUCT,
        LIST_PRICE: {
          $elemMatch: {
            TO_DATE: null,
            _id: ID_LIST_PRICE,
          },
        },
      },
      {
        $set: {
          "LIST_PRICE.$[element].PRICE_NUMBER": price_number,
          "LIST_PRICE.$[element].TO_DATE": new Date(),
        },
      },
      {
        arrayFilters: [
          {
            "element._id": ID_LIST_PRICE,
          },
        ],
      }
    );
    return update;
  };
  static getPriceProduct = async (id_product, keys, values) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const matchConditions = keys.map((key, index) => ({
      "LIST_PRICE.LIST_MATCH_KEY.KEY": key,
      "LIST_PRICE.LIST_MATCH_KEY.VALUE": values[index],
    }));

    const getPrice = await PriceModel.aggregate([
      {
        $match: {
          ID_PRODUCT: ID_PRODUCT,
        },
      },
      {
        $unwind: "$LIST_PRICE",
      },
      {
        $match: {
          $and: matchConditions,
        },
      },
      {
        $project: {
          _id: 0,
          PRICE_NUMBER: "$LIST_PRICE.PRICE_NUMBER",
          FROM_DATE: "$LIST_PRICE.FROM_DATE",
          TO_DATE: "$LIST_PRICE.TO_DATE",
          LIST_MATCH_KEY: "$LIST_PRICE.LIST_MATCH_KEY",
        },
      },
    ]);
    return getPrice;
    if (getPrice.length > 0) {
      return getPrice;
    } else {
      console.error("Không tìm thấy giá cho sản phẩm với thông số chỉ định.");
    }
  };

  static getPriceWithoutKey = async (id_product) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const getPrice = await PriceModel.aggregate([
      {
        $match: {
          ID_PRODUCT: ID_PRODUCT,
        },
      },
      {
        $unwind: {
          path: "$LIST_PRICE",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "LIST_PRICE.LIST_MATCH_KEY": [],
        },
      },
      {
        $project: {
          _id: 0,
          ID_PRODUCT: 1,
          PRICE_NUMBER: "$LIST_PRICE.PRICE_NUMBER",
          FROM_DATE: "$LIST_PRICE.FROM_DATE",
          TO_DATE: "$LIST_PRICE.TO_DATE",
        },
      },
    ]);
    return getPrice;
  };
}
module.exports = PriceService;
