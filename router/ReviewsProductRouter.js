const router = require("express").Router();
const verify = require("../middleware/verifyToken");
const ProductReviewsController = require("../controllers/productReviewController");
router.get("/getAll", ProductReviewsController.getAllReviews);
router.post("/:id", verify.verityToken, ProductReviewsController.addReviews);
router.get(
  "/:id",

  ProductReviewsController.getNumberStartProduct
);
router.get(
  "/totalReview/:id",
  verify.verityToken,
  ProductReviewsController.getTotalReviewsByIdProduct
);

module.exports = router;
