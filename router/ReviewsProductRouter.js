const router = require("express").Router();
const verify = require("../middleware/verifyToken");
const ProductReviewsController = require("../controllers/productReviewController");
router.post("/:id", verify.verityToken, ProductReviewsController.addReviews);
module.exports = router;
