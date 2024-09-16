const router = require("express").Router();
const productController = require("../controllers/productController");
const verify = require("../middleware/verifyToken");

router.get("/", productController.getProducts);
router.get("/search", productController.searchProducts);
router.get("/getAll", productController.getProductsAll);
router.get("/:id", productController.getProductById);
router.get("/category/:id", productController.getProductsByCategory);
router.post(
  "/fashion",
  verify.verityToken,
  productController.createProductFashion
);
router.post("/food", verify.verityToken, productController.createProductFood);
router.post("/phone", verify.verityToken, productController.createProductPhone);
router.post(
  "/earphone",
  verify.verityToken,
  productController.createProductEarphone
);
router.post(
  "/createProduct",
  verify.verityToken,
  productController.createProduct
);
router.put("/:id", verify.verityToken, productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
module.exports = router;
