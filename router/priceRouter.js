const router = require("express").Router();
const priceController = require("../controllers/priceController");
router.post("/:id", priceController.addPrice);
router.get("/:id", priceController.getPrice);
router.put("/:id_product/:id_list_price", priceController.updatePrice);
router.get("/:id_product", priceController.getPriceProduct);
router.get(
  "/defaultPrice/:id_priceDefault",
  priceController.getPriceWithoutKey
);
module.exports = router;
