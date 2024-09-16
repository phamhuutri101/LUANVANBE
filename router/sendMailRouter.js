const sendMailController = require("../controllers/sendMailControllers");
const router = require("express").Router();
router.post("/", sendMailController.sendMail);
module.exports = router;
