const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const verify = require("../middleware/verifyToken");

router.post(
  "/cancelOrder",
  verify.verityToken,
  orderController.updateStatusOrder7
);
router.post("/deleteOrder/:id", orderController.deleteOrder);
router.post("/sendGoods/:id", orderController.updateStatusOrder4);
router.post("/is_confirmed/:id", orderController.updateStatusOrder3);
router.post("/receivedGoods/:id", orderController.updateStatusOrder6);
router.post("/", verify.verityToken, orderController.addOrder);
router.get("/getOrderInDay", verify.verityToken, orderController.getOrderInDay);
router.get(
  "/getPriceInDay",
  verify.verityToken,
  orderController.calculateTotalPaymentInDay
);
router.get(
  "/getOrderProfitInDay",
  verify.verityToken,
  orderController.getOrderProfitInDay
);
router.get(
  "/calculateOrderProfit/:id_order",
  orderController.calculateOrderProfit
);
router.get(
  "/getPriceInMonth",
  verify.verityToken,
  orderController.calculateTotalPaymentInMonth
);
router.get("/lastStatusOrderCode/:id", orderController.getLastOrderStatus);
router.get("/", verify.verityToken, orderController.getUserOrder);
router.get(
  "/successPayment",
  verify.verityToken,
  orderController.getSuccessPayment
);
router.get(
  "/waitingPayment",
  verify.verityToken,
  orderController.getWaitingPayment
);
router.get("/:id", verify.verityToken, orderController.getOrderById);
module.exports = router;
