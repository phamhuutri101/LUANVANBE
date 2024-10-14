const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const verify = require("../middleware/verifyToken");
router.post("/", verify.verityToken, orderController.addOrder);
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
