const OrderService = require("../services/order.service");

class OrderController {
  static addOrder = async (req, res) => {
    try {
      const addOrder = await OrderService.addOrder(
        req.user.id_user,
        req.user.id,
        req.body.PROVINCE,
        req.body.DISTRICT,
        req.body.COMMUNE,
        req.body.DESC,
        req.body.PRICE,
        req.body.DISCOUNT,
        req.body.SHIPPING
      );
      if (addOrder.success == false) {
        res.status(200).json({
          success: false,
          message: "Thêm order thất bại",
          data1: addOrder,
        });
      } else {
        const statusOrder1 = await OrderService.statusOrder0(req.user.id);
        res.status(200).json({
          success: true,
          message: "Thêm order thành công",
          data1: addOrder,
          data2: statusOrder1,
        });
      }
      // const numberOrder = await OrderService.updateNumberProduct(
      //   req.user.id_user
      // );
      // res.status(200).json({ data: numberOrder });
    } catch (error) {
      console.error("Error in addOrder:", error.message);
      res.status(400).json({ error: error.message }); // Trả về lỗi chi tiết hơn
    }
  };
  static getUserOrder = async (req, res) => {
    try {
      const response = await OrderService.getUserOrder(req.user.id);
      res.status(200).json({
        success: true,
        message: "Lấy thông tin đơn hàng thành công",
        data: response,
      });
    } catch (error) {
      console.error("Error in addOrder:", error.message);
      res.status(400).json({ error: error.message });
    }
  };
  static getSuccessPayment = async (req, res) => {
    try {
      const response = await OrderService.getSuccessPayment(req.user.id);

      res.status(200).json({
        success: true,
        message: "Lấy thông tin đơn hàng đã thanh toán thành công",
        data: response,
      });
    } catch (error) {
      console.error("Error in addOrder:", error.message);
      res.status(400).json({ error: error.message });
    }
  };
  static getWaitingPayment = async (req, res) => {
    try {
      const response = await OrderService.getWaitingPayment(req.user.id);

      res.status(200).json({
        success: true,
        message: "Lấy thông tin đơn hàng đã thanh toán thành công",
        data: response,
      });
    } catch (error) {
      console.error("Error in addOrder:", error.message);
      res.status(400).json({ error: error.message });
    }
  };
  static getOrderById = async (req, res) => {
    try {
      const response = await OrderService.getOrderById(req.params.id);
      res.status(200).json({
        success: true,
        message: "Lấy thông tin đơn hàng thành công",
        data: response,
      });
    } catch (error) {
      console.error("Error in getOrderById:", error.message);
    }
  };
  static updateStatusOrder3 = async (req, res) => {
    try {
      const response = await OrderService.statusOrder3(
        req.params.id,
        req.body.id_order
      );
      res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái đã xác nhận",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  };
  static updateStatusOrder4 = async (req, res) => {
    try {
      const response = await OrderService.statusOrder4(
        req.params.id,
        req.body.id_order
      );
      res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái đã gửi hàng",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  };
  static updateStatusOrder6 = async (req, res) => {
    try {
      const response = await OrderService.statusOrder6(
        req.params.id,
        req.body.id_order
      );
      res.status(200).json({
        success: true,
        message: "Cập nhật trạng thái đã nhận hàng",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  };
  static getLastOrderStatus = async (req, res) => {
    try {
      const response = await OrderService.getLastOrderStatus(req.params.id);
      res.status(200).json({
        success: true,
        message: "Lấy thông tin trạng thái đơn hàng gần nhất",
        data: response,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null,
      });
    }
  };
}

module.exports = OrderController;
