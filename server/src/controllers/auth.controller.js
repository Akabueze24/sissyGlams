const User = require("../models/user");
const asyncHandler = require("../middleware/asyncHandler");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../utils/sendEmail");

/** Shape sent to the client — never include password or codes */
function toPublicUser(user) {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified === true,
  };
}

function generateSixDigitCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function clearPasswordResetFields(user) {
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetPurpose = undefined;
}

function clearEmailVerificationFields(user) {
  user.emailVerificationCode = undefined;
  user.emailVerificationExpires = undefined;
}

// ============================================================
// POST /api/auth/register
// Creates UNVERIFIED user + emails code — NO token
// ============================================================

const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error("Please provide firstName, lastName, email, and password");
  }

  if (String(password).length < 8) {
    res.status(400);
    throw new Error("Password must be at least 8 characters");
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = await User.findOne({ email: normalizedEmail });

  // Already a real (verified) account
  if (existing && existing.emailVerified === true) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  let user = existing;

  if (user) {
    // Unverified leftover — update profile/password and send a fresh code
    user.firstName = String(firstName).trim();
    user.lastName = String(lastName).trim();
    user.password = password; // pre-save hook should hash
    user.emailVerified = false;
  } else {
    user = await User.create({
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      email: normalizedEmail,
      password,
      role: "customer",
      emailVerified: false,
    });
  }

  const code = generateSixDigitCode();
  user.emailVerificationCode = code;
  user.emailVerificationExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    to: user.email,
    subject: "Verify your email — Sissy Dream",
    text: `Your verification code is ${code}. It expires in 15 minutes. If you did not create an account, ignore this email.`,
    html: `<p>Your verification code is <strong>${code}</strong>.</p>
           <p>It expires in 15 minutes.</p>
           <p>If you did not create an account, you can ignore this email.</p>`,
  });

  res.status(201).json({
    email: user.email,
    requiresEmailVerification: true,
    message: "Please verify your email with the code we sent.",
  });
});

// ============================================================
// POST /api/auth/login
// Blocks unverified accounts
// ============================================================

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (user.emailVerified !== true) {
    // Stable shape so the frontend can open OTP (no token)
    res.status(403).json({
      message: "Please verify your email before signing in.",
      requiresEmailVerification: true,
      email: user.email,
    });
    return;
  }

  res.json({
    user: toPublicUser(user),
    token: generateToken(user._id),
  });
});

// ============================================================
// POST /api/auth/verify-email  (PUBLIC — no JWT)
// Body: { email, code }
// On success → returns user + token
// ============================================================

const verifyEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    res.status(400);
    throw new Error("Please provide email and verification code");
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    res.status(400);
    throw new Error("Invalid email or verification code");
  }

  if (user.emailVerified) {
    // Already verified — issue token so client can sign them in
    return res.json({
      message: "Email is already verified",
      user: toPublicUser(user),
      token: generateToken(user._id),
    });
  }

  if (!user.emailVerificationCode || !user.emailVerificationExpires) {
    res.status(400);
    throw new Error("No verification pending. Request a new code.");
  }

  if (user.emailVerificationExpires.getTime() < Date.now()) {
    clearEmailVerificationFields(user);
    await user.save({ validateBeforeSave: false });
    res.status(400);
    throw new Error("Code has expired. Request a new code.");
  }

  if (String(code).trim() !== String(user.emailVerificationCode).trim()) {
    res.status(400);
    throw new Error("Invalid verification code");
  }

  user.emailVerified = true;
  clearEmailVerificationFields(user);
  await user.save();

  res.json({
    message: "Email verified successfully",
    user: toPublicUser(user),
    token: generateToken(user._id),
  });
});

// ============================================================
// POST /api/auth/resend-verification  (PUBLIC — no JWT)
// Body: { email }
// ============================================================

const resendEmailVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error("Please provide email");
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  // Same response whether or not user exists (avoid email enumeration)
  const genericMessage =
    "If an account exists for that email and is unverified, a code has been sent.";

  if (!user) {
    return res.json({ message: genericMessage });
  }

  if (user.emailVerified) {
    return res.json({ message: genericMessage });
  }

  const code = generateSixDigitCode();
  user.emailVerificationCode = code;
  user.emailVerificationExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    to: user.email,
    subject: "Verify your email — Sissy Dream",
    text: `Your verification code is ${code}. It expires in 15 minutes.`,
    html: `<p>Your verification code is <strong>${code}</strong>.</p>
           <p>It expires in 15 minutes.</p>`,
  });

  res.json({ message: genericMessage });
});

// ============================================================
// PATCH /api/auth/me  (protect)
// ============================================================

const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { firstName, lastName, email } = req.body;

  if (firstName != null) {
    user.firstName = String(firstName).trim();
  }

  if (lastName != null) {
    user.lastName = String(lastName).trim();
  }

  if (email != null) {
    const normalizedEmail = String(email).trim().toLowerCase();

    if (!normalizedEmail) {
      res.status(400);
      throw new Error("Email is required");
    }

    const taken = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: user._id },
    });

    if (taken) {
      res.status(400);
      throw new Error("An account with this email already exists");
    }

    if (normalizedEmail !== user.email) {
      user.email = normalizedEmail;
      user.emailVerified = false;
      clearEmailVerificationFields(user);
      // Client must re-verify; optionally force logout on frontend
    }
  }

  await user.save();

  res.json({
    user: toPublicUser(user),
  });
});

// ============================================================
// POST /api/auth/me/password/request-code  (protect)
// ============================================================

const requestPasswordChangeCode = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const code = generateSixDigitCode();
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  user.passwordResetCode = code;
  user.passwordResetExpires = expires;
  user.passwordResetPurpose = "change";
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    to: user.email,
    subject: "Your password change code — Sissy Dream",
    text: `Your password change code is ${code}. It expires in 15 minutes. If you did not request this, ignore this email.`,
    html: `<p>Your password change code is <strong>${code}</strong>.</p>
           <p>It expires in 15 minutes.</p>
           <p>If you did not request this, you can ignore this email.</p>`,
  });

  res.json({
    message: "A verification code has been sent to your email.",
  });
});

// ============================================================
// POST /api/auth/me/password/confirm  (protect)
// Body: { currentPassword, code, newPassword }
// ============================================================

const confirmPasswordChange = asyncHandler(async (req, res) => {
  const { currentPassword, code, newPassword } = req.body;

  if (!currentPassword || !code || !newPassword) {
    res.status(400);
    throw new Error("Please provide currentPassword, code, and newPassword");
  }

  if (String(newPassword).length < 8) {
    res.status(400);
    throw new Error("New password must be at least 8 characters");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.passwordResetPurpose !== "change") {
    res.status(400);
    throw new Error(
      "No password change request is pending. Request a new code.",
    );
  }

  if (!user.passwordResetCode || !user.passwordResetExpires) {
    res.status(400);
    throw new Error(
      "No password change request is pending. Request a new code.",
    );
  }

  if (user.passwordResetExpires.getTime() < Date.now()) {
    clearPasswordResetFields(user);
    await user.save({ validateBeforeSave: false });
    res.status(400);
    throw new Error("Code has expired. Request a new code.");
  }

  if (String(code).trim() !== String(user.passwordResetCode).trim()) {
    res.status(400);
    throw new Error("Invalid verification code");
  }

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  clearPasswordResetFields(user);
  await user.save();

  res.json({
    message: "Password updated successfully",
  });
});

// ============================================================
// ADDRESSES (protect)
// ============================================================

const getMyAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    shipping: user.shippingAddress || null,
    billing: user.billingAddress || null,
  });
});

const saveShippingAddress = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    address,
    apartment,
    city,
    state,
    postalCode,
    country,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !phone ||
    !address ||
    !city ||
    !state ||
    !postalCode ||
    !country
  ) {
    res.status(400);
    throw new Error("Please fill in all required address fields");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.shippingAddress = {
    firstName,
    lastName,
    phone,
    address,
    apartment: apartment || "",
    city,
    state,
    postalCode,
    country,
  };

  await user.save();

  res.json(user.shippingAddress);
});

const saveBillingAddress = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    phone,
    address,
    apartment,
    city,
    state,
    postalCode,
    country,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !phone ||
    !address ||
    !city ||
    !state ||
    !postalCode ||
    !country
  ) {
    res.status(400);
    throw new Error("Please fill in all required address fields");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.billingAddress = {
    firstName,
    lastName,
    phone,
    address,
    apartment: apartment || "",
    city,
    state,
    postalCode,
    country,
  };

  await user.save();

  res.json(user.billingAddress);
});

module.exports = {
  register,
  login,
  verifyEmail,
  resendEmailVerification,
  updateMe,
  requestPasswordChangeCode,
  confirmPasswordChange,
  getMyAddresses,
  saveShippingAddress,
  saveBillingAddress,
};
