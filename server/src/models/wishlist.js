const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    // Who owns this wishlist — one document per user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    // Product refs only (no qty / color / size — those are cart concerns)
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model('Wishlist', wishlistSchema);