const express = require("express");
const router = express.Router();
const SearchController = require("../controllers/SearchController");
router.get("/", SearchController.searchProduct);
module.exports = router;
