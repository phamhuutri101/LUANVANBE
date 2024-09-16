const router = require("express").Router();
const cartController = require("../controllers/cartController");
const verify = require("../middleware/verifyToken");
router.post("/:id", verify.verityToken, cartController.addCart);
router.get("/", verify.verityToken, cartController.getCart);
router.put("/:id", verify.verityToken, cartController.updateCart);
router.put("/", verify.verityToken, cartController.updateNumberCart);
router.delete("/:id", verify.verityToken, cartController.deleteCart);
module.exports = router;
