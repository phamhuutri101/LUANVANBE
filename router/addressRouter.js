const addressController = require("../controllers/addressController");
const verify = require("../middleware/verifyToken");
const router = require("express").Router();
// router.get("/", verify.verityToken, addressController.showAddress);
router.post("/", verify.verityToken, addressController.addAddress);
router.put("/:id", verify.verityToken, addressController.updateAddress);
router.get("/getUserByIdUser/:id", addressController.getAddressByIdUser);
router.get(
  "/default/",
  verify.verityToken,
  addressController.getDefaultAddress
);
router.get("/", verify.verityToken, addressController.getAddress);
router.put(
  "/updateIs_default/:id",
  verify.verityToken,
  addressController.updateIs_DefaultAddress
);
router.get("/:id", verify.verityToken, addressController.getAddressById);
router.delete("/:id", verify.verityToken, addressController.deleteAddress);
module.exports = router;
