const router = require("express").Router();
const productController = require("../controllers/productController");
const verify = require("../middleware/verifyToken");

router.get("/", productController.getProducts);
router.get("/search", productController.searchProducts);
router.get("/getAll", productController.getProductsAll);
router.get("/:id", productController.getProductById);
router.get("/category/:id", productController.getProductsByCategory);

router.post(
  "/createProduct",
  verify.verityToken,
  verify.checkPermissionShopper,
  productController.createProduct
);
router.put(
  "/:id",
  verify.verityToken,
  verify.checkPermissionShopper,
  productController.updateProduct
);
router.delete("/:id", productController.deleteProduct);
module.exports = router;
