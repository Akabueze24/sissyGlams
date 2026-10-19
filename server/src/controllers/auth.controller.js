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

//   if (String(password).length < 8) {
//     res.status(400);
//     throw new Error('Password must be at least 8 characters');
//   }

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

  // password is select:true by default; we need it for matchPassword
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

module.exports = {
  register,
  login,
};