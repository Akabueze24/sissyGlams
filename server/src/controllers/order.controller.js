const Order = require('../models/order'); // match your file
const Product = require('../models/product'); // match your file
const asyncHandler = require('../middleware/asyncHandler');

// ============================================================
// GET all (optional ?email=)
// ============================================================

const getOrders = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.email) {
    filter['customer.email'] = String(req.query.email).trim().toLowerCase();
  }

  const orders = await Order.find(filter).sort({ createdAt: -1 });
  res.json(orders);
});

// ============================================================
// GET one
// ============================================================

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.json(order);
});

// ============================================================
// CREATE — decrease stock in Mongo
// ============================================================

const createOrder = asyncHandler(async (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];

  if (!items.length) {
    res.status(400);
    throw new Error('Order must include at least one item');
  }

  // 1) Check stock for every line (fail before creating the order)
  for (const item of items) {
    const productId = item.productId;
    const quantity = Number(item.quantity) || 0;

    if (!productId || quantity < 1) {
      res.status(400);
      throw new Error('Each item needs a valid productId and quantity');
    }

    const product = await Product.findById(productId);

    if (!product) {
      res.status(400);
      throw new Error(`Product not found: ${productId}`);
    }

    if (product.stock < quantity) {
      res.status(400);
      throw new Error(
        `Not enough stock for "${product.name}". Available: ${product.stock}`,
      );
    }
  }

  // 2) Create the order
  const order = await Order.create(req.body);

  // 3) Decrease stock (order already saved)
  for (const item of items) {
    const quantity = Number(item.quantity) || 0;

    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -quantity },
    });
  }

  res.status(201).json(order);
});

// ============================================================
// UPDATE — restore stock only when moving TO cancelled
// ============================================================

const updateOrder = asyncHandler(async (req, res) => {
  const existing = await Order.findById(req.params.id);

  if (!existing) {
    res.status(404);
    throw new Error('Order not found');
  }

  const previousStatus = existing.orderStatus;

  const allowed = {};
  if (req.body.orderStatus != null) {
    allowed.orderStatus = req.body.orderStatus;
  }
  if (req.body.paymentStatus != null) {
    allowed.paymentStatus = req.body.paymentStatus;
  }

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { $set: allowed },
    { new: true, runValidators: true },
  );

  // Restore stock once: not cancelled → cancelled
  const becameCancelled =
    allowed.orderStatus === 'cancelled' && previousStatus !== 'cancelled';

  if (becameCancelled && Array.isArray(order.items)) {
    for (const item of order.items) {
      const quantity = Number(item.quantity) || 0;
      if (!item.productId || quantity < 1) continue;

      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: quantity },
      });
    }
  }

  res.json(order);
});

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
};