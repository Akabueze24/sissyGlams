const express = require('express')
const {
  login,
  register,
  updateMe,
  requestPasswordChangeCode,
  confirmPasswordChange,
  getMyAddresses,
  saveShippingAddress,
  saveBillingAddress,
  verifyEmail,
  resendEmailVerification
} = require("../controllers/auth.controller");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// PUBLIC — no protect
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendEmailVerification);

router.patch("/me", protect, updateMe);
router.post("/me/password/request-code", protect, requestPasswordChangeCode);
router.post("/me/password/confirm", protect, confirmPasswordChange);

router.get("/me/addresses", protect, getMyAddresses);
router.put("/me/addresses/shipping", protect, saveShippingAddress);
router.put("/me/addresses/billing", protect, saveBillingAddress);



module.exports = router;
