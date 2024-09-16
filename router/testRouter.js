const testController = require("../controllers/testController");
const router = require("express").Router();
router.post("/", testController.update);
module.exports = router;
