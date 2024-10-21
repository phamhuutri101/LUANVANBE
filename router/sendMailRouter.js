const sendMailController = require("../controllers/sendMailControllers");
const router = require("express").Router();
router.post("/", sendMailController.sendMail);
router.post("/order", sendMailController.sendMailOrder);
module.exports = router;
