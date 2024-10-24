const authController = require("../controllers/authControllers");
const verify = require("../middleware/verifyToken");
const router = require("express").Router();
router.post("/login", authController.loginUser);
router.post("/register", authController.registerUser);
router.post("/active", authController.activeAccount);
router.post("/repass", verify.verityToken, authController.changePassword);
router.post("/loginAdmin", authController.loginAdmin);
router.put(
  "/deleteUser/:id",
  verify.verityToken,
  verify.checkPermissionAdmin,
  authController.deleteUser
);
router.put(
  "/reactiveUser/:id",
  verify.verityToken,
  verify.checkPermissionAdmin,
  authController.reactiveUser
);
module.exports = router;
