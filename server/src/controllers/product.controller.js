const Product = require('../models/product');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * GET /api/products
 * ?all=true → admin (active + inactive)
 * default   → shop (active only)
 */
const getProducts = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { active: true };

  const products = await Product.find(filter).sort({ createdAt: -1 });
  res.json(products);
});

/**
 * GET /api/products/:slug
 * One active product by slug (storefront).
 */
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    active: true,
  });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

/**
 * POST /api/products
 * Create a product (protect with admin auth later).
 */
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

/**
 * PUT /api/products/id/:id
 * Update a product (protect with admin auth later).
 */
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true },
  );

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

/**
 * DELETE /api/products/id/:id
 * Delete a product (protect with admin auth later).
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ message: 'Product deleted', id: req.params.id });
});

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};