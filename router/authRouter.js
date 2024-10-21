const authController = require("../controllers/authControllers");
const verify = require("../middleware/verifyToken");
const router = require("express").Router();
router.post("/login", authController.loginUser);
router.post("/register", authController.registerUser);
router.post("/active", authController.activeAccount);
router.post("/repass", verify.verityToken, authController.changePassword);
module.exports = router;
