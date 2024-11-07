const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/categoryController");
router.get("/:id", categoryController.getCategoryById);
router.get("/", categoryController.getAllCategory);

router.post("/", categoryController.createCategory);

router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);
module.exports = router;
