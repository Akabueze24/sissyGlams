const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Collection name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Collection slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true } // drop if Category has no timestamps
);

module.exports = mongoose.model('Collection', collectionSchema);