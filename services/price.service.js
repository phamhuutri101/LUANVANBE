const PriceModel = require("../models/price");
const InventoryEntriesModel = require("../models/inventory_entries");
const ObjectId = require("mongoose").Types.ObjectId;
class PriceService {
  static addPrice = async (
    id_product,
    price_number,
    key,
    value,
    id_account
  ) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const ID_ACCOUNT = new ObjectId(id_account);

    // Kiểm tra sản phẩm có trong kho không
    const inventoryCheck = await InventoryEntriesModel.findOne({
      "LIST_PRODUCT_CREATED.ID_PRODUCT": ID_PRODUCT,
      IS_DELETE: false,
    });

    if (!inventoryCheck) {
      return {
        error:
          "Sản phẩm chưa nhập kho. Vui lòng nhập kho sản phẩm trước khi thêm giá.",
      };
    }

    // Xử lý danh sách LIST_MATCH_KEY từ key và value
    let listMatchKeys = [];
    if (
      Array.isArray(key) &&
      Array.isArray(value) &&
      key.length === value.length
    ) {
      for (let i = 0; i < key.length; i++) {
        listMatchKeys.push({
          KEY: key[i],
          VALUE: value[i],
        });
      }
    }

    // Tìm tài liệu `PriceModel` chứa `ID_PRODUCT` và `ID_ACCOUNT` phù hợp
    const priceDocument = await PriceModel.findOne({
      ID_PRODUCT: ID_PRODUCT,
      ID_ACCOUNT: ID_ACCOUNT,
      "LIST_PRICE.TO_DATE": null,
    });

    if (priceDocument) {
      // Duyệt qua LIST_PRICE để tìm phần tử có LIST_MATCH_KEY khớp với `listMatchKeys`
      const listPriceIndex = priceDocument.LIST_PRICE.findIndex(
        (price) =>
          price.LIST_MATCH_KEY.length === listMatchKeys.length &&
          price.LIST_MATCH_KEY.every(
            (keyValue, idx) =>
              keyValue.KEY === listMatchKeys[idx].KEY &&
              keyValue.VALUE === listMatchKeys[idx].VALUE
          )
      );

      if (listPriceIndex > -1) {
        // Nếu tìm thấy, cập nhật `PRICE_NUMBER` và `FROM_DATE` của phần tử tương ứng
        priceDocument.LIST_PRICE[listPriceIndex].PRICE_NUMBER = price_number;
        priceDocument.LIST_PRICE[listPriceIndex].FROM_DATE = new Date();

        // Lưu lại tài liệu sau khi cập nhật
        await priceDocument.save();
        return { success: true, message: "Cập nhật giá thành công" };
      }
    }

    // Nếu giá chưa tồn tại, thêm mới vào LIST_PRICE
    const addPrice = await PriceModel.updateOne(
      {
        ID_PRODUCT: ID_PRODUCT,
        ID_ACCOUNT: ID_ACCOUNT,
        LIST_PRICE_MAX_NUMBER: { $lt: 100 }, // Thay đổi giới hạn tùy nhu cầu
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

    if (addPrice.matchedCount === 0) {
      return {
        error: "Không thể thêm giá mới, LIST_PRICE_MAX_NUMBER đã đạt giới hạn.",
      };
    }

    return { success: true, message: "Thêm giá mới thành công" };
  };

  static getPrice = async (id_product) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const getALLPrice = PriceModel.aggregate([
      {
        $match: {
          ID_PRODUCT: ID_PRODUCT,
          IS_DELETE: false,
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
    console.log(id_product, id_list_price, price_number);

    const ID_PRODUCT = new ObjectId(id_product);
    const ID_LIST_PRICE = new ObjectId(id_list_price);

    const update = await PriceModel.updateOne(
      {
        ID_PRODUCT: ID_PRODUCT,
        "LIST_PRICE._id": ID_LIST_PRICE,
        "LIST_PRICE.TO_DATE": null, // Đảm bảo điều kiện này khớp với mục có TO_DATE = null
      },
      {
        $set: {
          "LIST_PRICE.$[element].PRICE_NUMBER": price_number,
          "LIST_PRICE.$[element].TO_DATE": new Date(),
        },
      },
      {
        arrayFilters: [{ "element._id": ID_LIST_PRICE }],
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
          IS_DELETE: false,
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
          IS_DELETE: false,
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

  static getPriceRange = async (id_product) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const getPrice = await PriceModel.aggregate([
      {
        $match: {
          ID_PRODUCT: ID_PRODUCT,
          IS_DELETE: false,
        },
      },
      {
        $unwind: {
          path: "$LIST_PRICE",
          preserveNullAndEmptyArrays: true,
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
  static getPriceByIdProduct = async (id_product) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const response = await PriceModel.findOne({
      ID_PRODUCT: ID_PRODUCT,
      IS_DELETE: false,
    });
    return response;
  };
  static addPriceDefaultIsMinPrice = async (id_product) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const product = await PriceModel.findOne(
      { ID_PRODUCT: ID_PRODUCT, IS_DELETE: false },
      { LIST_PRICE: 1 } // Chỉ lấy mảng LIST_PRICE
    );

    if (product && product.LIST_PRICE && product.LIST_PRICE.length > 0) {
      const minPrice = product.LIST_PRICE.reduce((min, current) => {
        return current.PRICE_NUMBER < min.PRICE_NUMBER ? current : min;
      });
      const priceNumber = minPrice.PRICE_NUMBER;
      const addPriceDefault = this.addPrice(id_product, priceNumber);
      return addPriceDefault;
    }

    return null; // Không có giá trị nào trong LIST_PRICE
  };

  static deletePrice = async (id_product, id_array) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const ID_LIST_PRICE = new ObjectId(id_array);

    const result = await PriceModel.updateOne(
      {
        ID_PRODUCT: ID_PRODUCT,
      },
      {
        $pull: {
          LIST_PRICE: {
            _id: ID_LIST_PRICE, // Xóa phần tử trong LIST_PRICE có _id khớp
          },
        },
        $inc: {
          LIST_PRICE_MAX_NUMBER: -1,
        },
      }
    );

    return result;
  };
  static getKeyValueListPrice = async (id_product, id_account, id_array) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const ID_ACCOUNT = new ObjectId(id_account);
    const ID_LIST_PRICE = new ObjectId(id_array);

    const response = await PriceModel.aggregate([
      {
        $match: {
          ID_PRODUCT: ID_PRODUCT,
          ID_ACCOUNT: ID_ACCOUNT,
          IS_DELETE: false,
        },
      },
      {
        $project: {
          _id: 0,
          LIST_PRICE: {
            $filter: {
              input: "$LIST_PRICE",
              as: "price",
              cond: { $eq: ["$$price._id", ID_LIST_PRICE] },
            },
          },
        },
      },
    ]);

    return response;
  };
}
module.exports = PriceService;
