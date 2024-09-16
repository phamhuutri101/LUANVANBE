const express = require("express");
const InventoryController = require("../controllers/inventory_entriesController");
const router = express.Router();
const verify = require("../middleware/verifyToken");
router.post(
  "/:id",
  verify.verityToken,
  InventoryController.addInventory_Entries
);
module.exports = router;
