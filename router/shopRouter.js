const ShopController = require("../controllers/shopController");
const router = require("express").Router();
const middleware = require("../middleware/verifyToken");
router.post("/", middleware.verityToken, ShopController.createShop);
router.get(
  "/checkActive",
  middleware.verityToken,
  ShopController.checkActiveShop
);
router.get(
  "/nameShop/:id",
  middleware.verityToken,
  ShopController.getShopByAccountId
);
module.exports = router;
