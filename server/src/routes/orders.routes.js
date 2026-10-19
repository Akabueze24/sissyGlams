const express = require('express');
const {getOrders, getOrderById, createOrder, updateOrder} = require('../controllers/order.controller');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Customer (or guest) places an order — no admin role required
router.post('/', createOrder);

// Admin only — full list, single order, status updates
router.get('/', protect, adminOnly, getOrders);
router.get('/id/:id', protect, adminOnly, getOrderById);
router.put('/id/:id', protect, adminOnly, updateOrder);

module.exports = router;