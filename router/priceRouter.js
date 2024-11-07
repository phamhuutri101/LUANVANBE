const router = require("express").Router();
const priceController = require("../controllers/priceController");
const verify = require("../middleware/verifyToken");
router.post(
  "/:id",
  verify.verityToken,
  verify.checkPermissionShopper,
  priceController.addPrice
);
router.post(
  "/deletePrice/:id",
  verify.verityToken,
  priceController.deletePrice
);

router.post("/get_price/:id", priceController.getPrice);
router.put("/:id_product/:id_list_price", priceController.updatePrice);
router.get("/addPriceDefault/:id", priceController.getMinPrice);
router.get("/getById/:id", priceController.getPriceByIdProduct);
router.get("/:id_product", priceController.getPriceProduct);
router.get(
  "/defaultPrice/:id_priceDefault",
  priceController.getPriceWithoutKey
);
router.get("/range/:id_product", priceController.getPriceRange);
module.exports = router;
