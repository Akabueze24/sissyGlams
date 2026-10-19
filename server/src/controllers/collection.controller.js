const Collection = require('../models/collection');
const asyncHandler = require('../middleware/asyncHandler');
const Product = require('../models/product');

const slugify = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// GET /api/collections
const getCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find().sort({ createdAt: -1 });

  res.status(200).json({
    count: collections.length,
    collections,
  });
});

// get one /api/collections

const getCollectionBySlug = asyncHandler(async (req, res) => {
  const collection = await Collection.findOne({slug: req.params.slug.toLowerCase()});
 if(!collection){
  res.status(404);
  throw new Error('collection by this slug does not exist')
 }

 res.status(200).json({collection})

})

// POST /api/collections
const createCollection = asyncHandler(async (req, res) => {
  const name = (req.body.name || '').trim();

  if (!name) {
    res.status(400);
    throw new Error('Collection name is required');
  }

  const slug = slugify(name);

  if (!slug) {
    res.status(400);
    throw new Error('Could not create a valid slug from that name');
  }

  const exists = await Collection.findOne({ slug });
  if (exists) {
    res.status(409);
    throw new Error('A collection with that name already exists');
  }

  const collection = await Collection.create({ name, slug });

  res.status(201).json({ collection });
});

// PUT /api/collections/:slug
const updateCollection = asyncHandler(async (req, res) => {
  const name = (req.body.name || '').trim();

  if (!name) {
    res.status(400);
    throw new Error('Collection name is required');
  }

  const slug = req.params.slug.toLowerCase();

  // 1. Make sure the collection exists
  const collection = await Collection.findOne({ slug });
  if (!collection) {
    res.status(404);
    throw new Error('Collection with this slug does not exist');
  }

  // 2. Make sure no OTHER collection already uses this name (case-insensitive)
  const duplicate = await Collection.findOne({
    slug: { $ne: slug },
    name,
  }).collation({ locale: 'en', strength: 2 });

  if (duplicate) {
    res.status(409);
    throw new Error('Another collection already uses this name');
  }

  // 3. Update the collection (slug stays the same)
  collection.name = name;
  await collection.save();

  // 4. Keep the embedded copies on products in sync
  await Product.updateMany(
    { 'collections.slug': slug },
    { $set: { 'collections.$[c].name': name } },
    { arrayFilters: [{ 'c.slug': slug }] }
  );

  res.status(200).json({ collection });
});

// DELETE /api/collections/:slug
const deleteCollection = asyncHandler(async (req, res) => {
  const slug = req.params.slug.toLowerCase();

  const collection = await Collection.findOne({ slug });
  if (!collection) {
    res.status(404);
    throw new Error('Collection with this slug does not exist');
  }

  // Guard: products still in this collection
  const productCount = await Product.countDocuments({
    'collections.slug': slug,
  });
  if (productCount > 0) {
    res.status(400);
    throw new Error(
      `Cannot delete this collection — ${productCount} product(s) still use it.`,
    );
  }

  await collection.deleteOne();

  res.status(200).json({ message: 'Collection deleted' });
});






module.exports = {
  getCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection

};