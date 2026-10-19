const mongoose = require('mongoose');

/**
 * Sub-schemas: small nested shapes used inside Product.
 * Why separate? Keeps the main schema readable and matches your Angular models
 * (colors, sizes, galleries, etc.).
 */

const productColorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true }, // e.g. "#000000"
    image: { type: String, default: '' }, // swatch URL
  },
  { _id: false },
);

const colorGallerySchema = new mongoose.Schema(
  {
    color: { type: productColorSchema, required: true },
    images: [{ type: String }],
  },
  { _id: false },
);

const optionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "Small"
    value: { type: String, required: true, trim: true }, // e.g. "S"
  },
  { _id: false },
);

const collectionRefSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const productDetailsSchema = new mongoose.Schema(
  {
    description: { type: String, default: '' },
    details: [{ type: String }],
    shipping: { type: String, default: '' },
    returns: { type: String, default: '' },
  },
  { _id: false },
);

/**
 * Main product document — aligned with your storefront Product model.
 * Mongo will add _id automatically; we also keep a string `id` if you want
 * stable IDs like your mock data (optional — can use only _id later).
 */
const productSchema = new mongoose.Schema(
  {
    // Human / app id (optional). Many apps only use Mongo's _id.
    // Keeping both makes migration from your mock data easier.
    id: {
      type: String,
      trim: true,
      sparse: true, // unique only when present
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },

    brand: {
      type: String,
      default: '',
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    subcategory: {
      type: String,
      trim: true,
      lowercase: true,
      default: undefined,
    },

    collections: {
      type: [collectionRefSchema],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    oldPrice: {
      type: Number,
      min: 0,
      default: undefined,
    },

    productDetails: {
      type: productDetailsSchema,
      default: () => ({}),
    },

    colors: {
      type: [productColorSchema],
      default: [],
    },

    colorGalleries: {
      type: [colorGallerySchema],
      default: [],
    },

    sizes: {
      type: [optionSchema],
      default: [],
    },

    lengths: {
      type: [optionSchema],
      default: [],
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Adds createdAt and updatedAt automatically
    timestamps: true,
  },
);

// Helpful for shop filters later
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ active: 1 });
productSchema.index({ name: 'text', brand: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;