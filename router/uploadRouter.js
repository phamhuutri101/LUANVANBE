// router/uploadRouter.js
const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const imagesControllers = require("../controllers/imagesControllers");

// Định nghĩa route để upload ảnh
router.post("/", upload.single("img"), imagesControllers.uploadImages);
router.post(
  "/images",
  upload.array("imgs", 10),
  imagesControllers.uploadManyImages
);

module.exports = router;
