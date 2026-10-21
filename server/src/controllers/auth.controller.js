const User = require('../models/user'); // match your filename
const asyncHandler = require('../middleware/asyncHandler');
const generateToken = require('../utils/generateToken');

/** Shape sent to the client — never include password */
function toPublicUser(user) {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
  };
}

// ============================================================
// POST /api/auth/register
// ============================================================

const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400);
    throw new Error('Please provide firstName, lastName, email, and password');
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({
    firstName: String(firstName).trim(),
    lastName: String(lastName).trim(),
    email: normalizedEmail,
    password, // hashed by pre('save') on the model
    role: 'customer', // never trust role from the client
  });

  res.status(201).json({
    user: toPublicUser(user),
    token: generateToken(user._id),
  });
});

// ============================================================
// POST /api/auth/login
// ============================================================

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    user: toPublicUser(user),
    token: generateToken(user._id),
  });
});

// ============================================================
// PATCH /api/auth/me  (protect)
// ============================================================

const updateMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
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
      throw new Error('Email is required');
    }

    const taken = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: user._id },
    });

    if (taken) {
      res.status(400);
      throw new Error('An account with this email already exists');
    }

    user.email = normalizedEmail;
  }

  await user.save();

  res.json({
    user: toPublicUser(user),
  });
});

// ============================================================
// PATCH /api/auth/me/password  (protect)
// ============================================================

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide currentPassword and newPassword');
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword; // hashed by pre('save')
  await user.save();

  res.json({
    message: 'Password updated successfully',
  });
});

// ============================================================
// GET /api/auth/me/addresses  (protect)
// ============================================================

const getMyAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json({
    shipping: user.shippingAddress || null,
    billing: user.billingAddress || null,
  });
});

// ============================================================
// PUT /api/auth/me/addresses/shipping  (protect)
// Creates the shipping address the first time, replaces it after
// ============================================================

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
    throw new Error('Please fill in all required address fields');
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.shippingAddress = {
    firstName,
    lastName,
    phone,
    address,
    apartment: apartment || '',
    city,
    state,
    postalCode,
    country,
  };

  await user.save();

  res.json(user.shippingAddress);
});

// ============================================================
// PUT /api/auth/me/addresses/billing  (protect)
// Creates the billing address the first time, replaces it after
// ============================================================

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
    throw new Error('Please fill in all required address fields');
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.billingAddress = {
    firstName,
    lastName,
    phone,
    address,
    apartment: apartment || '',
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
  updateMe,
  changePassword,
  getMyAddresses,
  saveShippingAddress,
  saveBillingAddress
};