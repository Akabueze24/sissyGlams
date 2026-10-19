const express = require("express");
const router = express.Router();

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} = require("../controllers/category.controller");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getCategories);
router.post("/", protect, adminOnly, createCategory);
router.put("/:slug", protect, adminOnly, updateCategory);
router.delete("/:slug", protect, adminOnly, deleteCategory);

router.post("/:slug/subcategories", protect, adminOnly, createSubcategory);
router.put(
  "/:slug/subcategories/:subSlug",
  protect,
  adminOnly,
  updateSubcategory,
);
router.delete(
  "/:slug/subcategories/:subSlug",
  protect,
  adminOnly,
  deleteSubcategory,
);

module.exports = router;
