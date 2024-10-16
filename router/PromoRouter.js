const router = require("express").Router();

const PromoCodeController = require("../controllers/promoControllers");
router.post("/", PromoCodeController.addPromoCode);
router.post("/checkPromoCode", PromoCodeController.checkPromoCode);
router.get("/", PromoCodeController.getAllPromoCodes);
module.exports = router;
