const Wishlist = require('../models/wishlist');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get my wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    'products',
  );

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    wishlist = await Wishlist.findById(wishlist._id).populate('products');
  }

  res.status(200).json({ products: wishlist.products });
});

// @desc    Save / replace my wishlist
// @route   PUT /api/wishlist
// @access  Private
const saveWishlist = asyncHandler(async (req, res) => {
  if (!Array.isArray(req.body.productIds)) {
    res.status(400);
    throw new Error('productIds must be an array.');
  }

  // Normalize: strings only, drop empties, unique
  const productIds = [
    ...new Set(
      req.body.productIds
        .map((id) => {
          if (typeof id === 'string') return id;
          return id?._id || id?.id || null;
        })
        .filter(Boolean),
    ),
  ];

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: req.user._id,
      products: productIds,
    });
  } else {
    wishlist.products = productIds;
    await wishlist.save();
  }

  wishlist = await Wishlist.findById(wishlist._id).populate('products');

  res.status(200).json({ products: wishlist.products });
});

module.exports = {
  getWishlist,
  saveWishlist,
};