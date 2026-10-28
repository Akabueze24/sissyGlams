const express = require('express');
const {
  getRates,
  getQuote,
  createRate,
  updateRate,
  deleteRate,
} = require('../controllers/shippingRate.controller');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/rates', getRates);
router.get('/quote/:countryCode', getQuote);

router.post('/rates', protect, adminOnly, createRate);
router.put('/rates/:id', protect, adminOnly, updateRate);
router.delete('/rates/:id', protect, adminOnly, deleteRate);

module.exports = router;