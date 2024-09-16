const CartModel = require("../models/cart");
const PriceModel = require("../models/price");
const ObjectId = require("mongoose").Types.ObjectId;
const PriceService = require("../services/price.service");
const ProductModel = require("../models/product");
class CartService {
  // xem lai xu ly don gia mac dinh
  static addCart = async (id_user, id_product, keys = [], values = []) => {
    const ID_USER = new ObjectId(id_user);
    const ID_PRODUCT = new ObjectId(id_product);
    let details = [];
    if (
      Array.isArray(keys) &&
      Array.isArray(values) &&
      keys.length === values.length
    ) {
      for (let i = 0; i < keys.length; i++) {
        details.push({
          KEY: keys[i],
          VALUE: values[i],
        });
      }
    }

    let getPrice;
    if (keys.length > 0 && values.length > 0) {
      getPrice = await PriceService.getPriceProduct(id_product, keys, values);
    } else {
      getPrice = await PriceService.getPriceWithoutKey(id_product);
    }
    const matchConditions =
      keys.length > 0
        ? keys.map((key, index) => ({
            "LIST_MATCH_KEY.KEY": key,
            "LIST_MATCH_KEY.VALUE": values[index],
          }))
        : [];
    const cart = await CartModel.findOne({
      USER_ID: ID_USER,
      LIST_PRODUCT: {
        $elemMatch: {
          ID_PRODUCT: ID_PRODUCT,
          TO_DATE: null,
        },
      },
    });
    if (cart) {
      if (matchConditions.length > 0) {
        const updateCart = await CartModel.updateOne(
          {
            USER_ID: ID_USER,
            "LIST_PRODUCT.ID_PRODUCT": ID_PRODUCT,
            "LIST_PRODUCT.TO_DATE": null,
            LIST_PRODUCT: {
              $elemMatch: {
                $and: matchConditions,
              },
            },
          },
          {
            $inc: {
              "LIST_PRODUCT.$[element].QUANTITY": 1,
            },
          },
          {
            arrayFilters: [
              {
                "element.ID_PRODUCT": ID_PRODUCT,
                "element.TO_DATE": null,
                "element.LIST_MATCH_KEY": {
                  $all: details.map((detail) => ({ $elemMatch: detail })), // xem lại chỗ này
                },
              },
            ],
          }
        );
        return updateCart;
      } else {
        // Khi không có matchConditions, cập nhật giỏ hàng bằng cách thêm sản phẩm mới hoặc tăng số lượng sản phẩm hiện có.
        const updateCart = await CartModel.updateOne(
          {
            USER_ID: ID_USER,
            "LIST_PRODUCT.ID_PRODUCT": ID_PRODUCT,
            "LIST_PRODUCT.TO_DATE": null,
          },
          {
            $inc: {
              "LIST_PRODUCT.$[element].QUANTITY": 1,
            },
          },
          {
            arrayFilters: [
              {
                "element.ID_PRODUCT": ID_PRODUCT,
                "element.TO_DATE": null,
              },
            ],
          }
        );
        return updateCart;
      }
    } else {
      const addCart = await CartModel.updateOne(
        {
          USER_ID: ID_USER,
          LIST_PRODUCT_MAX_NUMBER: {
            $lt: 10,
          },
        },
        {
          $push: {
            LIST_PRODUCT: {
              ID_PRODUCT: ID_PRODUCT,
              FROM_DATE: new Date(),
              TO_DATE: null,
              QUANTITY: 1,
              PRICE: getPrice[0].PRICE_NUMBER,
              LIST_MATCH_KEY: details,
            },
          },
          $inc: {
            LIST_PRODUCT_MAX_NUMBER: 1,
          },
        },
        {
          upsert: true,
        }
      );
      return addCart;
    }
  };
  static addCartNonKV = async (id_user, id_product) => {
    const ID_USER = new ObjectId(id_user);
    const ID_PRODUCT = new ObjectId(id_product);
    let getPrice;
    if (id_product) {
      getPrice = await PriceService.getPriceWithoutKey(id_product);
    }
    const cart = await CartModel.aggregate([
      {
        $match: {
          USER_ID: ID_USER,
        },
      },
      {
        $unwind: "$LIST_PRODUCT",
      },
      {
        $match: {
          "LIST_PRODUCT.ID_PRODUCT": ID_PRODUCT,
          "LIST_PRODUCT.TO_DATE": null,
          "LIST_PRODUCT.LIST_MATCH_KEY": [],
        },
      },
    ]);
    if (cart.length === 0) {
      const addCart = await CartModel.updateOne(
        {
          USER_ID: ID_USER,
          LIST_PRODUCT_MAX_NUMBER: {
            $lt: 10,
          },
        },
        {
          $push: {
            LIST_PRODUCT: {
              ID_PRODUCT: ID_PRODUCT,
              FROM_DATE: new Date(),
              TO_DATE: null,
              QUANTITY: 1,
              PRICE: getPrice[0].PRICE_NUMBER,
            },
          },
          $inc: {
            LIST_PRODUCT_MAX_NUMBER: 1,
          },
        },
        {
          upsert: true,
        }
      );
      return addCart;
    } else {
      const updateCart = await CartModel.updateOne(
        {
          USER_ID: ID_USER,
          "LIST_PRODUCT.ID_PRODUCT": ID_PRODUCT,
          "LIST_PRODUCT.TO_DATE": null,
          LIST_PRODUCT: {
            $elemMatch: {
              LIST_MATCH_KEY: [],
            },
          },
        },
        {
          $inc: {
            "LIST_PRODUCT.$[element].QUANTITY": 1,
          },
        },
        {
          arrayFilters: [
            {
              "element.ID_PRODUCT": ID_PRODUCT,
              "element.TO_DATE": null,
            },
          ],
        }
      );
      return updateCart;
    }
  };
  static addCartKV = async (id_user, id_product, keys, values, number = 1) => {
    const ID_USER = new ObjectId(id_user);
    const ID_PRODUCT = new ObjectId(id_product);
    let details = [];

    if (
      Array.isArray(keys) &&
      Array.isArray(values) &&
      keys.length === values.length
    ) {
      for (let i = 0; i < keys.length; i++) {
        details.push({
          KEY: keys[i],
          VALUE: values[i],
        });
      }
    }

    let getPrice;
    if (id_product) {
      getPrice = await PriceService.getPriceProduct(id_product, keys, values);
    }

    const matchConditions = details.map((detail) => ({
      $elemMatch: detail,
    }));
    let product;
    if (id_product) {
      product = await ProductModel.aggregate([
        {
          $match: {
            _id: ID_PRODUCT,
          },
        },
        {
          $unwind: "$QUANTITY_BY_KEY_VALUE",
        },
        {
          $match: {
            "QUANTITY_BY_KEY_VALUE.LIST_MATCH_KEY": {
              $all: matchConditions,
            },
          },
        },
      ]);
    }
    if (product.length === 0) {
      throw new Error("Không tìm thấy sản phẩm với thông số chỉ định.");
    }
    const cart = await CartModel.aggregate([
      {
        $match: {
          USER_ID: ID_USER,
        },
      },
      {
        $unwind: "$LIST_PRODUCT",
      },
      {
        $match: {
          "LIST_PRODUCT.ID_PRODUCT": ID_PRODUCT,
          "LIST_PRODUCT.TO_DATE": null,
          "LIST_PRODUCT.LIST_MATCH_KEY": {
            $all: matchConditions,
          },
        },
      },
    ]);
    if (cart.length === 0) {
      const addCart = await CartModel.updateOne(
        {
          USER_ID: ID_USER,
          LIST_PRODUCT_MAX_NUMBER: {
            $lt: 10,
          },
        },
        {
          $push: {
            LIST_PRODUCT: {
              ID_PRODUCT: ID_PRODUCT,
              FROM_DATE: new Date(),
              TO_DATE: null,
              QUANTITY: number,
              PRICE: getPrice[0].PRICE_NUMBER,
              LIST_MATCH_KEY: details,
              NUMBER_PRODUCT: product[0].QUANTITY_BY_KEY_VALUE.QUANTITY,
              ID_KEY_VALUE: product[0].QUANTITY_BY_KEY_VALUE,
            },
          },
          $inc: {
            LIST_PRODUCT_MAX_NUMBER: 1,
          },
        },
        {
          upsert: true,
        }
      );
      return addCart;
    } else {
      const updateCart = await CartModel.updateOne(
        {
          USER_ID: ID_USER,
          "LIST_PRODUCT.ID_PRODUCT": ID_PRODUCT,
          "LIST_PRODUCT.TO_DATE": null,
          "LIST_PRODUCT.LIST_MATCH_KEY": {
            $all: matchConditions,
          },
        },
        {
          $inc: {
            "LIST_PRODUCT.$[element].QUANTITY": +number,
          },
        },
        {
          arrayFilters: [
            {
              "element.ID_PRODUCT": ID_PRODUCT,
              "element.TO_DATE": null,
              "element.LIST_MATCH_KEY": {
                $all: matchConditions,
              },
            },
          ],
        }
      );
      return updateCart;
    }
  };

  static getCart = async (id_user, page, limit) => {
    page = Number(page);
    limit = Number(limit);
    const ID_USER = new ObjectId(id_user);
    const getCart = await CartModel.aggregate([
      {
        $match: {
          USER_ID: ID_USER,
        },
      },
      {
        $project: {
          LIST_PRODUCT: {
            $filter: {
              input: "$LIST_PRODUCT",
              as: "product",
              cond: {
                $eq: ["$$product.TO_DATE", null],
              },
            },
          },
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          LIST_PRODUCT_MAX_NUMBER: 0,
        },
      },
      {
        $unwind: {
          path: "$LIST_PRODUCT",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "LIST_PRODUCT.ID_PRODUCT",
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
        $project: {
          _id: 1,
          USER_ID: 1,
          ITEM: {
            $mergeObjects: [
              "$LIST_PRODUCT",
              {
                PRODUCT_DETAILS: "$PRODUCT",
              },
            ],
          },
        },
      },
      {
        $match: {
          ITEM: { $ne: {} },
        },
      },
    ]);

    return getCart;
  };

  static getAllCart = async (id_user) => {
    const ID_USER = new ObjectId(id_user);
    const getCart = await CartModel.aggregate([
      {
        $match: {
          USER_ID: ID_USER,
        },
      },
      {
        $project: {
          LIST_PRODUCT: {
            $filter: {
              input: "$LIST_PRODUCT",
              as: "product",
              cond: {
                $eq: ["$$product.TO_DATE", null],
              },
            },
          },
        },
      },
      {
        $project: {
          LIST_PRODUCT_MAX_NUMBER: 0,
        },
      },
      {
        $unwind: {
          path: "$LIST_PRODUCT",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "LIST_PRODUCT.ID_PRODUCT",
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
        $project: {
          _id: 1,
          USER_ID: 1,
          ITEM: {
            $mergeObjects: [
              "$LIST_PRODUCT",
              {
                PRODUCT_DETAILS: "$PRODUCT",
              },
            ],
          },
        },
      },
      {
        $project: {
          "ITEM._id": 0,
          "ITEM.PRODUCT_DETAILS._id": 0,
          "ITEM.PRODUCT_DETAILS.LIST_PRODUCT_METADATA": 0,
        },
      },
      {
        $match: {
          "ITEM.ID_PRODUCT": { $exists: true },
        },
      },
    ]);

    return getCart;
  };
  static getPriceCart = async (id_user) => {
    try {
      const ID_USER = new ObjectId(id_user);

      const getCart = await CartModel.aggregate([
        {
          $match: {
            USER_ID: ID_USER,
            "LIST_PRODUCT.TO_DATE": null,
          },
        },
        {
          $unwind: "$LIST_PRODUCT",
        },
        {
          $match: {
            "LIST_PRODUCT.TO_DATE": null,
          },
        },
        {
          $project: {
            "LIST_PRODUCT.ID_PRODUCT": 1,
            "LIST_PRODUCT.PRICE": 1,
            "LIST_PRODUCT.QUANTITY": 1,
          },
        },
      ]);

      let totalCart = 0;
      getCart.forEach((item) => {
        totalCart += item.LIST_PRODUCT.QUANTITY * item.LIST_PRODUCT.PRICE;
      });

      return totalCart;
    } catch (error) {
      console.error("Error in getPriceCart:", error);
      throw error; // Throwing the error to be handled by the caller
    }
  };
  static updateCart = async (id_user, id_product, body) => {
    const ID_USER = new ObjectId(id_user);
    const ID_PRODUCT = new ObjectId(id_product);
    const updateCart = await CartModel.updateOne(
      {
        USER_ID: ID_USER,
        LIST_PRODUCT: {
          $elemMatch: {
            ID_PRODUCT: ID_PRODUCT,
          },
        },
      },
      {
        $set: {
          "LIST_PRODUCT.$.QUANTITY": body,
        },
      }
    );
    return updateCart;
  };
  static getPriceProduct = async (id_product) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const getPrice = await PriceModel.aggregate([
      {
        $match: {
          ID_PRODUCT: ID_PRODUCT,
        },
      },
    ]);
    return getPrice;
  };
  static deleteAllCart = async (id_user) => {
    const ID_USER = new ObjectId(id_user);
    const deleteAllCart = await CartModel.updateMany(
      {
        USER_ID: ID_USER,
      },
      {
        $set: {
          "LIST_PRODUCT.$[elem].TO_DATE": new Date(),
        },
      },
      {
        arrayFilters: [{ elem: { $exists: true } }],
      }
    );
    return deleteAllCart;
  };
  static updateNumberProduct = async (id_product) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const updateCart = await ProductModel.updateMany(
      {
        LIST_PRODUCT: {
          $elemMatch: {
            ID_PRODUCT: ID_PRODUCT,
          },
        },
      },
      {
        $set: {
          "LIST_PRODUCT.$.QUANTITY": 0,
        },
      }
    );
    return updateCart;
  };
  // static updateNumberCart = async (userId, productId, matchKeys, newPrice) => {
  //   const ID_USER = new ObjectId(userId);
  //   const ID_PRODUCT = new ObjectId(productId);

  //   let updateQuery;

  //   if (matchKeys && matchKeys.length > 0) {
  //     const matchKeyConditions = matchKeys.map((matchKey) => ({
  //       "LIST_PRODUCT.LIST_MATCH_KEY.KEY": matchKey.KEY,
  //       "LIST_PRODUCT.LIST_MATCH_KEY.VALUE": matchKey.VALUE,
  //     }));

  //     updateQuery = {
  //       USER_ID: ID_USER,
  //       "LIST_PRODUCT.ID_PRODUCT": ID_PRODUCT,
  //       "LIST_PRODUCT.TO_DATE": null,
  //       $and: matchKeyConditions,
  //     };
  //   } else {
  //     updateQuery = {
  //       USER_ID: ID_USER,
  //       "LIST_PRODUCT.ID_PRODUCT": ID_PRODUCT,
  //       "LIST_PRODUCT.TO_DATE": null,
  //       "LIST_PRODUCT.LIST_MATCH_KEY": { $size: 0 },
  //     };
  //   }

  //   const updateCart = await CartModel.updateOne(updateQuery, {
  //     $set: {
  //       "LIST_PRODUCT.$.QUANTITY": newPrice,
  //     },
  //   });
  //   return updateCart;
  // };
  static updateNumberCart = async (
    user_id,
    product_id,
    id_list_product,
    number_cart
  ) => {
    const ID_USER = new ObjectId(user_id);
    const ID_PRODUCT = new ObjectId(product_id);
    const id = new ObjectId(id_list_product);

    const updateCart = await CartModel.updateOne(
      {
        USER_ID: ID_USER,
        "LIST_PRODUCT.ID_PRODUCT": ID_PRODUCT,
        "LIST_PRODUCT._id": id,
      },
      {
        $set: {
          "LIST_PRODUCT.$.QUANTITY": number_cart,
        },
      }
    );

    return updateCart;
  };

  static deleteCart = async (id_user, id_list_product) => {
    const ID_USER = new ObjectId(id_user);
    const ID_LIST_PRODUCT = new ObjectId(id_list_product);
    console.log("ID_USER:", id_user);
    console.log("ID_LIST_PRODUCT:", id_list_product);
    const deleteCart = await CartModel.updateOne(
      {
        USER_ID: ID_USER,
        "LIST_PRODUCT._id": ID_LIST_PRODUCT,
      },
      {
        $set: {
          "LIST_PRODUCT.$.TO_DATE": new Date(),
        },
      }
    );

    return deleteCart;
  };
}
module.exports = CartService;
