const Cart = require("../models/cart");
const asyncHandler = require("../middleware/asyncHandler");


// @desc    Get my cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
    cart = await Cart.findById(cart._id).populate("items.product");
  }

  res.status(200).json({ items: cart.items });
});

// @desc    Save / replace my cart
// @route   PUT /api/cart
// @access  Private
const saveCart = asyncHandler(async (req, res) => {
  if (!Array.isArray(req.body.items)) {
    res.status(400);
    throw new Error("items must be an array.");
  }

  const items = req.body.items
    .map((line) => {
      const productId =
        typeof line.product === "string"
          ? line.product
          : line.product?._id || line.product?.id;

      return {
        product: productId,
        quantity: Number(line.quantity) || 1,
        color: line.color,
        size: line.size,
        length: line.length,
      };
    })
    .filter((line) => line.product && line.quantity >= 1);

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items });
  } else {
    cart.items = items;
    await cart.save();
  }

  cart = await Cart.findById(cart._id).populate("items.product");

  res.status(200).json({ items: cart.items });
});

module.exports = {
  getCart,
  saveCart,
};