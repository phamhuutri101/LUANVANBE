const sendMailController = require("../controllers/sendMailControllers");
const router = require("express").Router();
router.post("/", sendMailController.sendMail);
router.post("/order", sendMailController.sendMailOrder);
router.post("/stopAccount", sendMailController.sendMailShopAccount);
router.post("/reactiveAccount", sendMailController.reactiveAccount);
module.exports = router;
