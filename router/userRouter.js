const userController = require("../controllers/userController");
const verify = require("../middleware/verifyToken");
const router = require("express").Router();
router.get("/getUserByAccountId/:id", userController.getUserByAccountId);
router.get(
  "/realtimeUser",
  verify.verityToken,
  userController.updateNumberUserRealTime
);
router.get("/userLogin", verify.verityToken, userController.getLoginUser);
router.get("/", userController.getAllUsers);
router.get("/:id", verify.verityToken, userController.getUserById);
router.put("/", verify.verityToken, userController.updateAvatar);
router.put("/updateProfile", verify.verityToken, userController.updateProfile);

module.exports = router;
