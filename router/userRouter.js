const userController = require("../controllers/userController");
const verify = require("../middleware/verifyToken");
const router = require("express").Router();
router.get("/userLogin", verify.verityToken, userController.getLoginUser);
router.get("/", userController.getAllUsers);
router.get("/:id", verify.verityToken, userController.getUserById);
module.exports = router;
