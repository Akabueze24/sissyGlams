const express = require("express");
const router = express.Router();

const {
  getCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
} = require("../controllers/collection.controller");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", getCollections);
router.get("/:slug", getCollectionBySlug);
router.post("/", protect, adminOnly, createCollection);
router.put("/:slug", protect, adminOnly, updateCollection);
router.delete("/:slug", protect, adminOnly, deleteCollection);

module.exports = router;
