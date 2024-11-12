const PaymentMethod = require("../services/payment.service");
const CartService = require("../services/cart.service");
const OrderService = require("../services/order.service");
const UserService = require("../services/user.service");
const codeOrder = require("../utils/code");
const moment = require("moment");
const CryptoJS = require("crypto-js");
const axios = require("axios").default;
const code = codeOrder();
const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};
const paymentController = {
  payment: async (req, res) => {
    const price = await CartService.getPriceCart(req.user.id_user);
    try {
      const payment = await PaymentMethod.payment(price);
      await OrderService.updateOrderCode(payment.orderId);
      await CartService.deleteAllCart(req.user.id_user);
      await OrderService.statusOrder5(req.user.id);
      await OrderService.statusOrder1(req.user.id);
      res.status(200).json(payment);
    } catch (error) {
      res.status(500).json({
        message: error.message,
        success: false,
        data: null,
      });
    }
  },
  callbacks: async (req, res) => {
    console.log("callbacks");
    console.log(req.body);
    const { orderId, resultCode, partnerCode, orderType } = req.body;
    if (resultCode == 0) {
      await OrderService.updateStatusOrderMomo(orderId, orderType);
    }
    return res.status(200).json(req.body);
  },

  transactionStatus: async (req, res) => {
    try {
      const payment = await PaymentMethod.transactionStatus(req.body);
      res.status(200).json({
        message: "kiểm tra thanh toán",
        success: true,
        data: payment,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        success: false,
        data: null,
      });
    }
  },
  paymentCOD: async (req, res) => {
    try {
      const cod = await OrderService.updateStatusCOD(code, "COD");
      CartService.deleteAllCart(req.user.id_user);
      await OrderService.statusOrder2COD(req.user.id);
      await OrderService.statusOrder1(req.user.id);
      res.status(200).json({
        message: "success",
        success: true,
        data: cod,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        success: false,
        data: null,
      });
    }
  },

  paymentZaloPay: async (req, res) => {
    const price = await CartService.getPriceCart(req.user.id_user);
    const embed_data = {
      //sau khi hoàn tất thanh toán sẽ đi vào link này (thường là link web thanh toán thành công của mình)
      redirecturl: "http://localhost:3000/",
    };

    const items = [];
    const transID = Math.floor(Math.random() * 1000000);

    const order = {
      app_id: config.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: "user123",
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: price,
      //khi thanh toán xong, zalopay server sẽ POST đến url này để thông báo cho server của mình
      //Chú ý: cần dùng ngrok để public url thì Zalopay Server mới call đến được
      callback_url:
        "https://17e9-2402-800-6343-d18d-34d8-c7ed-ec24-3f07.ngrok-free.app/v1/payment/callbackZalo",
      description: `Lazada - Payment for the order #${transID}`,
      bank_code: "",
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
      config.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    try {
      const result = await axios.post(config.endpoint, null, { params: order });
      await OrderService.updateOrderCode(code);
      if (result.data.return_code == 1) {
        await CartService.deleteAllCart(req.user.id_user);
        await OrderService.statusOrder5(req.user.id);
        await OrderService.statusOrder1(req.user.id);
      }

      return res.status(200).json(result.data);
    } catch (error) {
      console.log(error);
    }
  },
  callbacksZaloPay: async (req, res, next) => {
    let result = {};
    console.log(req.body);
    try {
      let dataStr = req.body.data;
      let reqMac = req.body.mac;

      let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
      console.log("mac =", mac);

      // kiểm tra callback hợp lệ (đến từ ZaloPay server)
      if (reqMac !== mac) {
        // callback không hợp lệ
        result.return_code = -1;
        result.return_message = "mac not equal";
      } else {
        // thanh toán thành công
        // merchant cập nhật trạng thái cho đơn hàng ở đây
        const type = req.body.type;
        console.log(type);
        if (type === 1) {
          await OrderService.updateStatusOrderZaloPay(code, "ZALO PAY");
        }
        let dataJson = JSON.parse(dataStr, config.key2);
        console.log(
          "update order's status = success where app_trans_id =",
          dataJson["app_trans_id"]
        );

        result.return_code = 1;
        result.return_message = "success";
      }
    } catch (ex) {
      console.log("lỗi:::" + ex.message);
      result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
      result.return_message = ex.message;
    }

    // thông báo kết quả cho ZaloPay server
    res.json(result);
  },
};
module.exports = paymentController;
