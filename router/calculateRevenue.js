const router = require("express").Router();
const calculateRevenue = require("../controllers/calculateRevenue");
const verify = require("../middleware/verifyToken");
router.get("/:id", verify.verityToken, calculateRevenue.calculateRevenue);
module.exports = router;
