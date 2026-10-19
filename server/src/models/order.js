const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    color: {
      name: String,
      value: String,
      image: String,
    },
    size: {
      name: String,
      value: String,
    },
    length: {
      name: String,
      value: String,
    },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, required: true },
    },

    shippingAddress: {
      address: { type: String, required: true },
      apartment: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
      deliveryLocation: { type: String, required: true },
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'Order must have at least one item',
      },
    },

    subtotal: { type: Number, required: true, min: 0 },
    shippingCost: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },

    shippingMethod: {
      type: String,
      enum: ['standard', 'express'],
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: [
        'card',
        'bank-transfer',
        'ussd',
        'apple-pay',
        'google-pay',
        'crypto',
      ],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },

    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true, // createdAt + updatedAt
  },
);

module.exports = mongoose.model('Order', orderSchema);