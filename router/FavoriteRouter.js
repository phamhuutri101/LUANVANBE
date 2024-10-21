const express = require("express");
const router = express.Router();
const FavoriteController = require("../controllers/favoriteController");
const verify = require("../middleware/verifyToken");
router.post("/:id", verify.verityToken, FavoriteController.addFavorite);
router.put("/:id", verify.verityToken, FavoriteController.updateFavorite);
router.get("/", verify.verityToken, FavoriteController.getProductFavorite);
router.get("/:id", verify.verityToken, FavoriteController.getFavorite);

module.exports = router;
