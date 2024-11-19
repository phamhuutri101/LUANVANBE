const OrderModel = require("../models/order");
const ObjectId = require("mongoose").Types.ObjectId;
const ProductModel = require("../models/product");
const randomCode = require("../utils/code");
const AddressService = require("../services/address.services");
const CartService = require("../services/cart.service");
const UserService = require("../services/user.service");
const Inventory_EntriesService = require("../services/inventory_entries.service");
const InventoryEntriesModel = require("../models/inventory_entries");
const code = randomCode();
class OrderService {
  static addOrder = async (
    id_user,
    id_account,
    province,
    district,
    commune,
    desc,
    price,
    reduce,
    shipping
  ) => {
    try {
      const ID_USER = new ObjectId(id_user);
      const ID_ACCOUNT = new ObjectId(id_account);
      const PhoneUser = await UserService.getNumberPhoneUser(ID_ACCOUNT);
      const ListProductData = await CartService.getAllCart(ID_USER);
      if (!ListProductData || ListProductData.length === 0) {
        return {
          success: false,
          message: "Không có sản phẩm nào trong giỏ hàng",
        };
      } else {
        const ListProduct = ListProductData.map((cart) => ({
          ID_PRODUCT: cart.ITEM.ID_PRODUCT,
          FROM_DATE: cart.ITEM.FROM_DATE,
          TO_DATE: cart.ITEM.TO_DATE,
          UNITPRICES: cart.ITEM.PRICE,
          QLT: cart.ITEM.QUANTITY,
          LIST_MATCH_KEY: cart.ITEM.LIST_MATCH_KEY,
          ID_KEY_VALUE: cart.ITEM.ID_KEY_VALUE,
          NUMBER_PRODUCT: cart.ITEM.NUMBER_PRODUCT,
        }));
        const newOrder = await OrderModel.create({
          ORDER_CODE: null,
          ORDER_PRICE: price,
          PRICE_REDUCED: reduce,
          SHIPPING_FEE: shipping,
          PHONE_USER: PhoneUser,
          LIST_PRODUCT: ListProduct,
          ACCOUNT__ID: ID_ACCOUNT,
          PAYMENT_METHOD: null,
          IS_PAYMENT: false,
          TIME_PAYMENT: null,
          CANCEL_REASON: null,
          ADDRESS_USER: {
            PROVINCE: province,
            DISTRICT: district,
            COMMUNE: commune,
            DESC: desc,
          },
        });
        return newOrder;
      }
    } catch (error) {
      console.error("Error in addOrder:", error.message);
      throw error; // Re-throw the error to be handled by the calling function
    }
  };
  static updateOrderCode = async (orderCode) => {
    const lastOrder = await OrderModel.findOne({ ORDER_CODE: null }).sort({
      _id: -1,
    });
    if (lastOrder) {
      const update = await OrderModel.updateOne(
        { _id: lastOrder._id },
        {
          ORDER_CODE: orderCode,
        }
      );
      return update;
    }
  };
  static updateStatusOrderMomo = async (orderCode, payment_method) => {
    const update = await OrderModel.updateOne(
      { ORDER_CODE: orderCode },
      {
        IS_PAYMENT: true,
        TIME_PAYMENT: new Date(),
        PAYMENT_METHOD: payment_method,
      }
    );
    return update;
  };
  static updateStatusOrderZaloPay = async (orderCode, payment_method) => {
    const update = await OrderModel.updateOne(
      { ORDER_CODE: orderCode },
      {
        IS_PAYMENT: true,
        TIME_PAYMENT: new Date(),
        PAYMENT_METHOD: payment_method,
      }
    );
    return update;
  };
  static updateStatusCOD = async (orderCode, payment_method) => {
    const lastOrder = await OrderModel.findOne({ ORDER_CODE: null }).sort({
      _id: -1,
    });

    if (lastOrder) {
      const update = await OrderModel.updateOne(
        { _id: lastOrder._id },
        {
          ORDER_CODE: orderCode,
          IS_PAYMENT: false,
          TIME_PAYMENT: null,
          PAYMENT_METHOD: payment_method,
          TIME_PAYMENT: new Date(),
        }
      );
      return update;
    } else {
      return null;
    }
  };

  // trạng thái đã thanh toán
  static statusOrder5 = async (id_account) => {
    const ID_ACCOUNT = new ObjectId(id_account);
    const lastOrder = await OrderModel.findOne({
      ACCOUNT__ID: ID_ACCOUNT,
    }).sort({ _id: -1 });
    if (lastOrder) {
      await OrderModel.updateOne(
        {
          _id: lastOrder._id,
          "LIST_STATUS.TO_DATE": null,
        },
        {
          $set: {
            "LIST_STATUS.$.TO_DATE": new Date(),
          },
        }
      );
      await OrderService.updateNumberProductPayment(
        lastOrder.LIST_PRODUCT[0].ID_PRODUCT,
        lastOrder.LIST_PRODUCT[0].ID_KEY_VALUE,
        lastOrder.LIST_PRODUCT[0].QLT
      );
      await Inventory_EntriesService.updateNumberInventoryProduct(
        lastOrder.LIST_PRODUCT[0].ID_PRODUCT
      );
      const updateStatus = await OrderModel.updateOne(
        {
          _id: lastOrder._id,
        },
        {
          $push: {
            LIST_STATUS: {
              STATUS_NAME: "Đã thanh toán Online",
              STATUS_CODE: 5,
              FROM_DATE: new Date(),
              TO_DATE: null,
            },
          },
        }
      );
      return updateStatus;
    }
  };
  static statusOrder2COD = async (id_account) => {
    const ID_ACCOUNT = new ObjectId(id_account);
    const lastOrder = await OrderModel.findOne({
      ACCOUNT__ID: ID_ACCOUNT,
    }).sort({ _id: -1 });
    // lastOrder.LIST_PRODUCT[0].ID_PRODUCT
    // lastOrder.LIST_PRODUCT[0].NUMBER_PRODUCT
    // lastOrder.LIST_PRODUCT[0].ID_KEY_VALUE
    if (lastOrder) {
      await OrderModel.updateOne(
        {
          _id: lastOrder._id,
          "LIST_STATUS.TO_DATE": null,
        },
        {
          $set: {
            "LIST_STATUS.$.TO_DATE": new Date(),
          },
        }
      );
      await OrderService.updateNumberProductPayment(
        lastOrder.LIST_PRODUCT[0].ID_PRODUCT,
        lastOrder.LIST_PRODUCT[0].ID_KEY_VALUE,
        lastOrder.LIST_PRODUCT[0].QLT
      );
      await Inventory_EntriesService.updateNumberInventoryProduct(
        lastOrder.LIST_PRODUCT[0].ID_PRODUCT
      );
      const updateStatus = await OrderModel.updateOne(
        {
          _id: lastOrder._id,
        },
        {
          $push: {
            LIST_STATUS: {
              STATUS_NAME: "chưa hoàn thành thanh toán",
              STATUS_CODE: 2,
              FROM_DATE: new Date(),
              TO_DATE: null,
            },
          },
        }
      );
      return updateStatus;
    }
  };
  // Trạng thái chờ thanh toán
  static statusOrder0 = async (id_account) => {
    const ID_ACCOUNT = new ObjectId(id_account);
    const lastOrder = await OrderModel.findOne({
      ACCOUNT__ID: ID_ACCOUNT,
    }).sort({ _id: -1 });
    if (lastOrder) {
      const updateStatus = await OrderModel.updateOne(
        { _id: lastOrder.id },
        {
          $push: {
            LIST_STATUS: {
              STATUS_NAME: "Chờ thanh toán",
              STATUS_CODE: 0,
              FROM_DATE: new Date(),
              TO_DATE: null,
            },
          },
        }
      );
      return updateStatus;
    }
  };

  // Trạng thái chờ xác nhận
  static statusOrder1 = async (id_account) => {
    const ID_ACCOUNT = new ObjectId(id_account);
    const lastOrder = await OrderModel.findOne({
      ACCOUNT__ID: ID_ACCOUNT,
    }).sort({ _id: -1 });
    if (lastOrder) {
      const updateStatus = await OrderModel.updateOne(
        { _id: lastOrder.id },
        {
          $push: {
            LIST_STATUS: {
              STATUS_NAME: "Chờ xác nhận",
              STATUS_CODE: 1,
              FROM_DATE: new Date(),
              TO_DATE: null,
            },
          },
        }
      );
      return updateStatus;
    }
  };
  static statusOrder3 = async (id_account, id_order) => {
    const ID_ACCOUNT = new ObjectId(id_account);
    const ID_ORDER = new ObjectId(id_order);
    const lastOrder = await OrderModel.findOne({
      ACCOUNT__ID: ID_ACCOUNT,
      _id: ID_ORDER,
    }).sort({ _id: -1 });
    if (lastOrder) {
      await OrderModel.updateOne(
        {
          _id: lastOrder._id,
          "LIST_STATUS.TO_DATE": null,
        },
        {
          $set: {
            "LIST_STATUS.$.TO_DATE": new Date(),
          },
        }
      );
      const updateStatus = await OrderModel.updateOne(
        {
          _id: lastOrder._id,
        },
        {
          $push: {
            LIST_STATUS: {
              STATUS_NAME: "đã xác nhận",
              STATUS_CODE: 3,
              FROM_DATE: new Date(),
              TO_DATE: null,
            },
          },
        }
      );
      return updateStatus;
    }
  };
  static statusOrder4 = async (id_account, id_order) => {
    const ID_ACCOUNT = new ObjectId(id_account);
    const ID_ORDER = new ObjectId(id_order);
    const lastOrder = await OrderModel.findOne({
      ACCOUNT__ID: ID_ACCOUNT,
      _id: ID_ORDER,
    }).sort({ _id: -1 });
    // lastOrder.LIST_PRODUCT[0].ID_PRODUCT
    // lastOrder.LIST_PRODUCT[0].NUMBER_PRODUCT
    // lastOrder.LIST_PRODUCT[0].ID_KEY_VALUE
    if (lastOrder) {
      await OrderModel.updateOne(
        {
          _id: lastOrder._id,
          "LIST_STATUS.TO_DATE": null,
        },
        {
          $set: {
            "LIST_STATUS.$.TO_DATE": new Date(),
          },
        }
      );

      const updateStatus = await OrderModel.updateOne(
        {
          _id: lastOrder._id,
        },
        {
          $push: {
            LIST_STATUS: {
              STATUS_NAME: "đã gửi hàng",
              STATUS_CODE: 4,
              FROM_DATE: new Date(),
              TO_DATE: null,
            },
          },
        }
      );
      return updateStatus;
    }
  };
  static statusOrder6 = async (id_account, id_order) => {
    const ID_ACCOUNT = new ObjectId(id_account);
    const ID_ORDER = new ObjectId(id_order);

    const lastOrder = await OrderModel.findOne({
      ACCOUNT__ID: ID_ACCOUNT,
      _id: ID_ORDER,
    }).sort({ _id: -1 });

    if (lastOrder) {
      // Cập nhật trường IS_PAYMENT
      await OrderModel.updateOne(
        {
          _id: lastOrder._id,
        },
        {
          $set: {
            IS_PAYMENT: true,
            TIME_PAYMENT: new Date(),
          },
        }
      );

      // Cập nhật TO_DATE trong LIST_STATUS cho mục cuối cùng
      await OrderModel.updateOne(
        {
          _id: lastOrder._id,
          "LIST_STATUS.TO_DATE": null,
        },
        {
          $set: {
            "LIST_STATUS.$.TO_DATE": new Date(),
          },
        }
      );

      // Thêm trạng thái mới vào LIST_STATUS
      const updateStatus = await OrderModel.updateOne(
        {
          _id: lastOrder._id,
        },
        {
          $push: {
            LIST_STATUS: {
              STATUS_NAME: "đã nhận hàng",
              STATUS_CODE: 6,
              FROM_DATE: new Date(),
              TO_DATE: null,
            },
          },
        }
      );

      return updateStatus;
    }
  };
  static statusOrder7 = async (id_account, id_order, content_cancel) => {
    const ID_ACCOUNT = new ObjectId(id_account);
    const ID_ORDER = new ObjectId(id_order);

    const lastOrder = await OrderModel.findOne({
      ACCOUNT__ID: ID_ACCOUNT,
      _id: ID_ORDER,
    }).sort({ _id: -1 });

    if (lastOrder) {
      await OrderModel.updateOne(
        {
          _id: lastOrder._id,
        },
        {
          $set: {
            IS_PAYMENT: false,
            TIME_CANCEL: new Date(),
            CANCEL_REASON: content_cancel,
          },
        }
      );
      await OrderService.updateNumberProductReturn(
        lastOrder.LIST_PRODUCT[0].ID_PRODUCT,
        lastOrder.LIST_PRODUCT[0].ID_KEY_VALUE,
        lastOrder.LIST_PRODUCT[0].QLT
      );
      await Inventory_EntriesService.updateNumberInventoryProduct(
        lastOrder.LIST_PRODUCT[0].ID_PRODUCT
      );
      // Cập nhật TO_DATE trong LIST_STATUS cho mục cuối cùng
      await OrderModel.updateOne(
        {
          _id: lastOrder._id,
          "LIST_STATUS.TO_DATE": null,
        },
        {
          $set: {
            "LIST_STATUS.$.TO_DATE": new Date(),
          },
        }
      );

      // Thêm trạng thái mới vào LIST_STATUS
      const updateStatus = await OrderModel.updateOne(
        {
          _id: lastOrder._id,
        },
        {
          $push: {
            LIST_STATUS: {
              STATUS_NAME: "đã hủy",
              STATUS_CODE: 7,
              FROM_DATE: new Date(),
              TO_DATE: null,
            },
          },
        }
      );

      return updateStatus;
    }
  };
  static getLastOrderStatus = async (idOrder) => {
    try {
      // Tìm order theo idOrder
      const order = await OrderModel.findById(idOrder).select("LIST_STATUS");

      // Kiểm tra nếu order không tồn tại hoặc LIST_STATUS trống
      if (!order || order.LIST_STATUS.length === 0) {
        return null; // hoặc trả về giá trị mặc định nếu không có
      }

      // Lấy STATUS_CODE của phần tử cuối trong LIST_STATUS
      const lastStatusCode =
        order.LIST_STATUS[order.LIST_STATUS.length - 1].STATUS_CODE;

      return lastStatusCode;
    } catch (error) {
      console.error("Lỗi khi lấy STATUS_CODE:", error);
      throw error;
    }
  };
  // static updateNumberProduct = async (id_user, keys, values) => {
  //   const ID_USER = new ObjectId(id_user);
  //   const Cart = CartService.getAllCart(ID_USER);
  //   const NumberProduct = (await Cart)
  //     .filter((item) => item.success)
  //     .map((cart) => ({
  //       QUANTITY: cart.data.ITEM.QUANTITY,
  //     }));

  //   let matchCondition = {
  //     $and: keys.map((key, index) => ({
  //       "LIST_MATCH_KEY.KEY": key,
  //       "LIST_MATCH_KEY.VALUE": values[index],
  //     })),
  //   };
  //   const updateQuantity = await ProductModel.findOneAndUpdate(
  //     {
  //       _id: ID,
  //       QUANTITY_BY_KEY_VALUE: {
  //         $elemMatch: matchCondition,
  //       },
  //     },
  //     {
  //       $inc: {
  //         "QUANTITY_BY_KEY_VALUE.$.QUANTITY": quantity,
  //       },
  //     },
  //     { new: true, runValidators: true }
  //   );
  // };
  static updateNumberProduct = async (id_account) => {
    try {
      const ID_ACCOUNT = new ObjectId(id_account);
      const order = await OrderModel.aggregate([
        {
          $match: {
            ACCOUNT__ID: ID_ACCOUNT,
          },
        },
        {
          $unwind: "$LIST_PRODUCT",
        },
      ]);

      if (!order || order.length === 0) {
        throw new Error("Order không tồn tại");
      }

      const item = order[0].LIST_PRODUCT; // Vì LIST_PRODUCT là một đối tượng

      let updateQuery = {
        _id: item.ID_PRODUCT,
      };

      if (item.LIST_MATCH_KEY && item.LIST_MATCH_KEY.length > 0) {
        const matchCondition = {
          $and: item.LIST_MATCH_KEY.map((keyValuePair) => ({
            "LIST_MATCH_KEY.KEY": keyValuePair.KEY,
            "LIST_MATCH_KEY.VALUE": keyValuePair.VALUE,
          })),
        };
        updateQuery["QUANTITY_BY_KEY_VALUE"] = { $elemMatch: matchCondition };
      }

      const updateOperation = {
        $inc: {
          "QUANTITY_BY_KEY_VALUE.$.QUANTITY": -item.QLT, // Giả sử bạn muốn trừ đi số lượng
        },
      };

      const updateOptions = {
        new: true,
        runValidators: true,
      };

      let updateQuantity;
      if (item.LIST_MATCH_KEY && item.LIST_MATCH_KEY.length > 0) {
        updateQuantity = await ProductModel.findOneAndUpdate(
          updateQuery,
          updateOperation,
          updateOptions
        );
      } else {
        // Xử lý khi LIST_MATCH_KEY là mảng rỗng
        updateQuantity = await ProductModel.findByIdAndUpdate(
          item.ID_PRODUCT,
          {
            $inc: {
              NUMBER_INVENTORY_PRODUCT: -item.QLT,
            },
          },
          updateOptions
        );
      }

      if (!updateQuantity) {
        throw new Error("Không thể cập nhật số lượng sản phẩm");
      }

      return updateQuantity;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  };
  static getUserOrder = async (id_account, page = 1, limit = 10) => {
    const ID_ACCOUNT = new ObjectId(id_account);
    page = Number(page);
    limit = Number(limit);
    const order = await OrderModel.aggregate([
      {
        $match: {
          ACCOUNT__ID: ID_ACCOUNT,

          IS_DELETE: false,
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: "products",
          localField: "LIST_PRODUCT.ID_PRODUCT",
          foreignField: "_id",
          as: "PRODUCT",
        },
      },
      {
        $unwind: "$PRODUCT",
      },
    ]);
    return order;
  };

  // static updateNumberProductPayment = async (id_account) =>{
  //   const ID_ACCOUNT = new ObjectId(id_account);
  //   const Cart = CartService.getAllCart(ID_ACCOUNT);
  //   const NumberProduct = (await Cart)
  //    .filter((item) => item.success)
  //    .map((cart) => ({
  //       QUANTITY: cart.data.ITEM.QUANTITY,
  //     }));
  //   const updateQuantity = await ProductModel.findOneAndUpdate(
  //     {
  //       _id: ID,
  //       QUANTITY_BY_KEY_VALUE: {
  //         $elemMatch: matchCondition,
  //       },
  //     },
  //     {
  //       $inc: {
  //         "QUANTITY_BY_KEY_VALUE.$.QUANTITY": quantity,
  //       },
  //     },
  //     { new: true, runValidators: true }
  //   );
  //   return updateQuantity;
  // }
  static updateNumberProductPayment = async (
    id_product,
    id_key_value,
    number_cart
  ) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const ID_KEY_VALUE = new ObjectId(id_key_value);
    const update = ProductModel.updateOne(
      {
        _id: ID_PRODUCT,

        "QUANTITY_BY_KEY_VALUE._id": ID_KEY_VALUE,
      },
      {
        $inc: {
          "QUANTITY_BY_KEY_VALUE.$.QUANTITY": -number_cart,
        },
      }
    );
    return update;
  };
  static updateNumberProductReturn = async (
    id_product,
    id_key_value,
    number_cart
  ) => {
    const ID_PRODUCT = new ObjectId(id_product);
    const ID_KEY_VALUE = new ObjectId(id_key_value);
    const update = ProductModel.updateOne(
      {
        _id: ID_PRODUCT,

        "QUANTITY_BY_KEY_VALUE._id": ID_KEY_VALUE,
      },
      {
        $inc: {
          "QUANTITY_BY_KEY_VALUE.$.QUANTITY": +number_cart,
        },
      }
    );
    return update;
  };
  static getSuccessPayment = async (id_account) => {
    const ID_ACCOUNT = new ObjectId(id_account);
    const order = await OrderModel.aggregate([
      {
        $match: {
          ACCOUNT__ID: ID_ACCOUNT,
          IS_PAYMENT: true,
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
        $unwind: "$PRODUCT",
      },
    ]);
    return order;
  };
  static getWaitingPayment = async (id_account) => {
    const ID_ACCOUNT = new ObjectId(id_account);
    const order = await OrderModel.aggregate([
      {
        $match: {
          ACCOUNT__ID: ID_ACCOUNT,
          IS_PAYMENT: false,
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
        $unwind: "$PRODUCT",
      },
    ]);
    return order;
  };
  static getOrderById = async (idOrder) => {
    const ID_ORDER = new ObjectId(idOrder);
    const order = await OrderModel.findById(ID_ORDER);
    return order;
  };
  static deleteOrder = async (idOrder) => {
    const ID_ORDER = new ObjectId(idOrder);
    const deletedOrder = await OrderModel.updateOne(
      {
        _id: ID_ORDER,
      },
      {
        IS_DELETE: true,
      }
    );
    return deletedOrder;
  };
  static calculateTotalOrderInDay = async (id_account) => {
    try {
      const ID_ACCOUNT = new ObjectId(id_account);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Start of the day
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // End of the current day

      // Aggregate orders that have a payment time within the current day
      const total = await OrderModel.aggregate([
        {
          $match: {
            ACCOUNT__ID: ID_ACCOUNT,
            TIME_PAYMENT: { $gte: today, $lt: tomorrow },
            IS_PAYMENT: true, // Ensures only completed payments are considered
          },
        },
        {
          $group: {
            _id: null,
            totalOrderPrice: { $sum: "$ORDER_PRICE" }, // Sum of ORDER_PRICE only
          },
        },
      ]);

      return total[0]?.totalOrderPrice || 0; // Return the total order price or 0 if no results
    } catch (error) {
      console.error("Error calculating total order price in day:", error);
      throw error;
    }
  };

  static calculateTotalOrderInMonth = async (id_account) => {
    try {
      const ID_ACCOUNT = new ObjectId(id_account);
      const startOfMonth = new Date();
      startOfMonth.setDate(1); // Đặt ngày bắt đầu là ngày đầu tiên của tháng
      startOfMonth.setHours(0, 0, 0, 0); // Đặt thời gian bắt đầu từ đầu ngày

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(startOfMonth.getMonth() + 1); // Đặt thời gian kết thúc là ngày đầu tiên của tháng tiếp theo

      // Thực hiện phép tổng hợp để tính tổng số tiền giao dịch trong tháng
      const total = await OrderModel.aggregate([
        {
          $match: {
            ACCOUNT__ID: ID_ACCOUNT,
            TIME_PAYMENT: { $gte: startOfMonth, $lt: endOfMonth },
            IS_PAYMENT: true, // Đảm bảo chỉ tính các giao dịch đã hoàn tất
          },
        },
        {
          $group: {
            _id: null,
            totalOrderPrice: { $sum: "$ORDER_PRICE" }, // Tổng hợp trường ORDER_PRICE
          },
        },
      ]);

      return total[0]?.totalOrderPrice || 0; // Trả về tổng số tiền hoặc 0 nếu không có kết quả
    } catch (error) {
      console.error("Error calculating total order price in month:", error);
      throw error;
    }
  };

  static getOrderInDay = async (id_account) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Thiết lập thời điểm bắt đầu của ngày
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Thiết lập thời điểm kết thúc của ngày
    const ID_ACCOUNT = new ObjectId(id_account);
    const orders = await OrderModel.aggregate([
      {
        $match: {
          ACCOUNT__ID: ID_ACCOUNT,
          TIME_PAYMENT: { $gte: startOfDay, $lte: endOfDay },
          IS_DELETE: false,
        },
      },
    ]);

    return orders;
  };
  static getOrderProfitInDay = async (id_account) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Thiết lập thời điểm bắt đầu của ngày
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Thiết lập thời điểm kết thúc của ngày
    const ID_ACCOUNT = new ObjectId(id_account);

    // Lấy đơn hàng trong ngày
    const orders = await OrderModel.aggregate([
      {
        $match: {
          ACCOUNT__ID: ID_ACCOUNT,
          TIME_PAYMENT: { $gte: startOfDay, $lte: endOfDay },
          IS_DELETE: false,
        },
      },
    ]);

    if (!orders.length) return { totalProfit: 0, orders: [] };

    const productIds = [];
    orders.forEach((order) => {
      order.LIST_PRODUCT.forEach((product) => {
        productIds.push(product.ID_PRODUCT);
      });
    });

    // Lấy giá nhập kho cuối cùng của từng sản phẩm
    const inventoryEntries = await InventoryEntriesModel.aggregate([
      {
        $unwind: "$LIST_PRODUCT_CREATED",
      },
      {
        $match: {
          "LIST_PRODUCT_CREATED.ID_PRODUCT": { $in: productIds },
          IS_DELETE: false,
        },
      },
      {
        $sort: {
          "LIST_PRODUCT_CREATED.ID_PRODUCT": 1,
          CRATED_DATE: -1,
        },
      },
      {
        $group: {
          _id: "$LIST_PRODUCT_CREATED.ID_PRODUCT",
          lastUnitPrice: { $first: "$LIST_PRODUCT_CREATED.UNIT_PRICE" },
        },
      },
    ]);

    const lastUnitPrices = {};
    inventoryEntries.forEach((entry) => {
      lastUnitPrices[entry._id.toString()] = entry.lastUnitPrice;
    });

    // Tính lợi nhuận từng đơn hàng
    let totalProfit = 0;
    const orderProfits = orders.map((order) => {
      let orderProfit = 0;

      order.LIST_PRODUCT.forEach((product) => {
        const productId = product.ID_PRODUCT.toString();
        const lastUnitPrice = lastUnitPrices[productId] || 0;

        // Lợi nhuận sản phẩm = (giá bán - giá nhập kho cuối cùng) * số lượng - giảm giá
        const productProfit =
          (product.UNITPRICES - lastUnitPrice) * product.NUMBER_PRODUCT;
        orderProfit += productProfit;
      });

      // Trừ giảm giá trên đơn hàng
      orderProfit -= order.PRICE_REDUCED;

      // Tổng cộng lợi nhuận
      totalProfit += orderProfit;

      return {
        orderId: order._id,
        profit: orderProfit,
      };
    });

    return { totalProfit, orders: orderProfits };
  };
  static calculateOrderProfit = async (orderId) => {
    try {
      // Lấy thông tin đơn hàng theo ORDER_ID
      const order = await OrderModel.findById(orderId).lean();

      if (!order) {
        throw new Error("Đơn hàng không tồn tại");
      }

      let totalRevenue = 0; // Tổng giá bán
      let totalCost = 0; // Tổng giá nhập kho cuối

      // Duyệt qua từng sản phẩm trong đơn hàng
      for (const product of order.LIST_PRODUCT) {
        // Tính tổng giá bán của sản phẩm
        const productRevenue = product.UNITPRICES * product.NUMBER_PRODUCT;
        totalRevenue += productRevenue;

        // Lấy giá nhập cuối cùng cho sản phẩm và biến thể
        const lastInventoryEntry = await InventoryEntriesModel.aggregate([
          { $unwind: "$LIST_PRODUCT_CREATED" },
          {
            $match: {
              "LIST_PRODUCT_CREATED.ID_PRODUCT": product.ID_PRODUCT,
              "LIST_PRODUCT_CREATED.DETAILS": {
                $all: product.LIST_MATCH_KEY.map((keyValue) => ({
                  $elemMatch: { KEY: keyValue.KEY, VALUE: keyValue.VALUE },
                })),
              },
              IS_DELETE: false,
            },
          },
          { $sort: { CRATED_DATE: -1 } }, // Lấy phiếu nhập mới nhất
          { $limit: 1 },
        ]);

        // Lấy giá nhập cuối (nếu không tìm thấy, mặc định là 0)
        const lastUnitPrice =
          lastInventoryEntry[0]?.LIST_PRODUCT_CREATED.UNIT_PRICE || 0;

        // Tính tổng giá nhập kho cuối
        totalCost += lastUnitPrice * product.NUMBER_PRODUCT;
      }

      // Tính lợi nhuận
      const profit = totalRevenue - totalCost - (order.PRICE_REDUCED || 0);

      // Kết quả
      return {
        orderId: order._id,
        totalRevenue,
        totalCost,
        discount: order.PRICE_REDUCED || 0,
        profit,
      };
    } catch (error) {
      throw new Error(`Lỗi khi tính lợi nhuận: ${error.message}`);
    }
  };
}

module.exports = OrderService;
