const mongoose = require('mongoose');

const storeSettingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      trim: true,
      default: 'Sissy Glams',
    },
    storeEmail: {
      type: String,
      trim: true,
      default: '',
    },
    storePhone: {
      type: String,
      trim: true,
      default: '',
    },
    storeDescription: {
      type: String,
      trim: true,
      default: '',
    },
    storeAddress: {
      type: String,
      trim: true,
      default: '',
    },
    announcementBar: {
      type: String,
      trim: true,
      default: '',
    },
    baseCurrency: {
      type: String,
      default: 'USD',
    },
    storeActive: {
      type: Boolean,
      default: true,
    },
    guestCheckout: {
      type: Boolean,
      default: true,
    },
    shippingNotice: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StoreSettings', storeSettingsSchema);