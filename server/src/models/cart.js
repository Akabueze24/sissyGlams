const mongoose = require("mongoose");

// Optional variant pieces (same idea as your Angular CartItem)
const variantColorSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    value: { type: String, trim: true }, // e.g. hex
    image: { type: String, trim: true }, // swatch URL
  },
  { _id: false }
);

const variantOptionSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    value: { type: String, trim: true },
  },
  { _id: false }
);

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    color: { type: variantColorSchema, default: undefined },
    size: { type: variantOptionSchema, default: undefined },
    length: { type: variantOptionSchema, default: undefined },
  },
  { _id: true } // useful if you later PATCH/DELETE one line by id
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one cart document per user
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);