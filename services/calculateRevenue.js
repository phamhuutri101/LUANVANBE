const OrderModel = require("../models/order"); // Giả sử các model của bạn ở trong thư mục models
const InventoryModel = require("../models/inventory_entries");
const ObjectId = require("mongoose").Types.ObjectId;
class calculateRevenueService {
  static calculateOrderRevenue = async (orderId) => {
    try {
      // Tìm đơn hàng theo ID
      const order = await OrderModel.findById(orderId).populate(
        "LIST_PRODUCT.ID_PRODUCT"
      );
      if (!order) {
        throw new Error("Order not found");
      }

      // Tổng giá bán các sản phẩm
      const totalSalePrice = order.LIST_PRODUCT.reduce((total, product) => {
        return total + product.UNITPRICES * product.NUMBER_PRODUCT;
      }, 0);

      // Tổng giá nhập của các sản phẩm
      const totalCostPrice = await calculateRevenueService.calculateTotalCost(
        order.LIST_PRODUCT
      );

      // Lấy phí ship và mã giảm giá từ đơn hàng
      const shippingFee = order.SHIPPING_FEE || 0;
      const priceReduced = order.PRICE_REDUCED || 0;

      // Tính doanh thu theo công thức
      const revenue =
        totalSalePrice - totalCostPrice + shippingFee - priceReduced;

      // return {
      //   revenue,
      //   orderId,
      //   details: {
      //     totalSalePrice,
      //     totalCostPrice,
      //     shippingFee,
      //     priceReduced,
      //   },

      // };
      return totalSalePrice;
    } catch (error) {
      console.error("Error calculating revenue:", error);
      throw error;
    }
  };

  // Hàm tính tổng giá nhập của các sản phẩm
  static calculateTotalCost = async (products) => {
    const productIds = products.map((product) => product.ID_PRODUCT);

    // Lấy thông tin các sản phẩm trong kho từ InventoryModel
    const inventoryEntries = await InventoryModel.aggregate([
      { $unwind: "$LIST_PRODUCT_CREATED" },
      { $match: { "LIST_PRODUCT_CREATED.ID_PRODUCT": { $in: productIds } } },
      {
        $group: {
          _id: "$LIST_PRODUCT_CREATED.ID_PRODUCT",
          totalImportCost: { $sum: "$LIST_PRODUCT_CREATED.TOTAL_IMPORT_CONST" },
        },
      },
    ]);

    // Tạo bản đồ để tra cứu giá nhập cho từng sản phẩm
    const costMap = inventoryEntries.reduce((map, entry) => {
      map[entry._id] = entry.totalImportCost;
      return map;
    }, {});

    // Tính tổng giá nhập của đơn hàng
    return products.reduce((totalCost, product) => {
      const costPrice = costMap[product.ID_PRODUCT.toString()] || 0;
      return totalCost + costPrice * product.NUMBER_PRODUCT;
    }, 0);
  };
}

module.exports = calculateRevenueService;
