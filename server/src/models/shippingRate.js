const mongoose = require('mongoose');

const shippingRateSchema = new mongoose.Schema(
  {
    countryCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    countryName: {
      type: String,
      required: true,
      trim: true,
    },
    standard: {
      type: Number,
      required: true,
      min: 0,
    },
    express: {
      type: Number,
      required: true,
      min: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('ShippingRate', shippingRateSchema);