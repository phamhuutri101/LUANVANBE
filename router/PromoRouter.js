const router = require("express").Router();
const verify = require("../middleware/verifyToken");
const PromoCodeController = require("../controllers/promoControllers");
router.post("/checkActivePromoCode", PromoCodeController.checkActivePromoCode);
router.post("/", verify.verityToken, PromoCodeController.addPromoCode);
router.post("/checkPromoCode", PromoCodeController.checkPromoCode);
router.post(
  "/delete/:id",
  verify.verityToken,
  PromoCodeController.deletePromoCodes
);
router.get("/", verify.verityToken, PromoCodeController.getAllPromoCodes);
module.exports = router;
