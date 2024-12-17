const router = require("express").Router();
const cartController = require("../controllers/cartController");
const verify = require("../middleware/verifyToken");
router.post(
  "/getQuantity/:id",
  verify.verityToken,
  cartController.getQuantityInCart
);
router.post("/:id", verify.verityToken, cartController.addCart);
router.get("/", verify.verityToken, cartController.getCart);
router.get("/getAll", verify.verityToken, cartController.getAllCart);
router.put(
  "/updatePriceAndShipping",
  verify.verityToken,
  cartController.updateShippingAndPriceReduced
);
router.put("/:id", verify.verityToken, cartController.updateCart);
router.put("/", verify.verityToken, cartController.updateNumberCart);
router.delete("/:id", verify.verityToken, cartController.deleteCart);
module.exports = router;
