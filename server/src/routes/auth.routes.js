// auth.routes.js
const express = require("express");
const {
  login,
  register,
  updateMe,
  changePassword,
  getMyAddresses,
  saveShippingAddress,
  saveBillingAddress
} = require("../controllers/auth.controller");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.patch("/me", protect, updateMe);
router.patch("/me/password", protect, changePassword);

router.get("/me/addresses", protect, getMyAddresses);

router.put("/me/addresses/shipping", protect, saveShippingAddress);

router.put("/me/addresses/billing", protect, saveBillingAddress);

module.exports = router;
