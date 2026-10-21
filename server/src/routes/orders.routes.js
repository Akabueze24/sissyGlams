const express = require('express');
const {
  getOrders,
  getOrderById,
  getMyOrders,
  createOrder,
  updateOrder,
} = require('../controllers/order.controller');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', createOrder);

// Customer: own orders only
router.get('/mine', protect, getMyOrders);

// Admin
router.get('/', protect, adminOnly, getOrders);
router.get('/id/:id', protect, adminOnly, getOrderById);
router.put('/id/:id', protect, adminOnly, updateOrder);

module.exports = router;