// models/subcategory.js
const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    // Parent category slug — same as Angular Subcategory.category
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true },
);

// Same slug allowed in different categories; unique within one category
subcategorySchema.index({ category: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Subcategory', subcategorySchema);