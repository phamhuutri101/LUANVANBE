const { verify } = require("jsonwebtoken");
const ShopController = require("../controllers/shopController");
const router = require("express").Router();
const middleware = require("../middleware/verifyToken");
router.post("/", middleware.verityToken, ShopController.checkTimeActiveShop);
router.post("/:id", middleware.verityToken, ShopController.cancelActiveShop);
router.get("/", middleware.verityToken, ShopController.getShop);
router.get(
  "/getNameShopper",
  middleware.verityToken,
  ShopController.getNameShopByIdAccountShopper
);
router.get("/getNameShop/:id", ShopController.getNameShopByIdAccount);
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
router.get(
  "/nonActive",
  middleware.verityToken,
  ShopController.getShopNonActive
);
router.post("/active/:id", middleware.verityToken, ShopController.activeShop);
module.exports = router;
