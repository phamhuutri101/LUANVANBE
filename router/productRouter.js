const router = require("express").Router();
const productController = require("../controllers/productController");
const verify = require("../middleware/verifyToken");
router.get(
  "/getProductTotalShopper",
  verify.verityToken,
  productController.getTotalProductShopper
);
router.get(
  "/getProductShopByIdAccount/:id",
  productController.getProductShopByIdAccount
);

router.get("/getProductTotalShop/:id", productController.getTotalProductShop);
router.get(
  "/getKV/:id",
  productController.getProductKeyValue,
  verify.verityToken
);
router.get("/", productController.getProducts);
router.get("/search", productController.searchProducts);
router.get("/getAll", productController.getProductsAll);
router.get(
  "/shopProduct",
  verify.verityToken,

  productController.getProductShop
);
router.get("/:id", productController.getProductById);
router.get("/category/:id", productController.getProductsByCategory);

router.post(
  "/createProduct",
  verify.verityToken,

  productController.createProduct
);
router.put(
  "/:id",
  verify.verityToken,

  productController.updateProduct
);
router.delete("/:id", productController.deleteProduct);
module.exports = router;
