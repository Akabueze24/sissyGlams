const express = require("express");
const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// ---------- Public (storefront) ----------
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

// ---------- Admin only ----------
router.post("/", protect, adminOnly, createProduct);
router.put("/id/:id", protect, adminOnly, updateProduct);
router.delete("/id/:id", protect, adminOnly, deleteProduct);

module.exports = router;
