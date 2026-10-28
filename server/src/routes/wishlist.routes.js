const express = require('express');
const { getWishlist, saveWishlist } = require('../controllers/wishlist.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getWishlist);
router.put('/', protect, saveWishlist);

module.exports = router;