const Category = require("../models/category");
const Subcategory = require("../models/subcategory");
const asyncHandler = require("../middleware/asyncHandler");
const Product = require("../models/product");

// ============================================================
// HELPERS
// ============================================================

const slugify = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// ============================================================
// GET — full nav tree (CategoryNavItem[])
// ============================================================

/**
 * GET /api/categories
 * Public — used by header, shop, admin
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ label: 1 }).lean();
  const subcategories = await Subcategory.find().lean();

  const nav = categories.map((c) => ({
    category: c.slug,
    label: c.label,
    subcategories: subcategories
      .filter((s) => s.category === c.slug)
      .map((s) => ({
        name: s.name,
        slug: s.slug,
        category: s.category,
      })),
  }));

  res.json(nav);
});

// ============================================================
// CATEGORY — CREATE
// ============================================================

/**
 * POST /api/categories
 * Body: { label: "Dresses" }
 * Admin only
 */
const createCategory = asyncHandler(async (req, res) => {
  const label = (req.body.label || "").trim();

  if (!label) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const slug = slugify(label);

  if (!slug) {
    res.status(400);
    throw new Error("Could not create a valid slug from that name");
  }

  const exists = await Category.findOne({ slug });
  if (exists) {
    res.status(400);
    throw new Error("A category with this name already exists");
  }

  const category = await Category.create({ slug, label });

  res.status(201).json({
    category: category.slug,
    label: category.label,
    subcategories: [],
  });
});

// ============================================================
// CATEGORY — UPDATE (label only, slug stays)
// ============================================================

/**
 * PUT /api/categories/:slug
 * Body: { label: "All Dresses" }
 * Admin only
 */
const updateCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const label = (req.body.label || "").trim();

  if (!label) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const category = await Category.findOne({ slug });
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  const duplicate = await Category.findOne({
    slug: { $ne: slug },
    label,
  }).collation({ locale: "en", strength: 2 });
  
  if (duplicate) {
    res.status(400);
    throw new Error("Another category already uses this name");
  }

  category.label = label;
  await category.save();

  const subcategories = await Subcategory.find({ category: slug }).lean();

  res.json({
    category: category.slug,
    label: category.label,
    subcategories: subcategories.map((s) => ({
      name: s.name,
      slug: s.slug,
      category: s.category,
    })),
  });
});

// ============================================================
// CATEGORY — DELETE (and its subcategories)
// ============================================================

/**
 * DELETE /api/categories/:slug
 * Admin only
 * Blocked if any product still uses this category.
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const category = await Category.findOne({ slug });
  if (!category) {
    res.status(400);
    throw new Error("Category not found");
  }

  // Guard: products still assigned to this category
  const productCount = await Product.countDocuments({ category: slug });
  if (productCount > 0) {
    res.status(400);
    throw new Error(
      `Cannot delete this category — ${productCount} product(s) still use it.`,
    );
  }

  await Subcategory.deleteMany({ category: slug });
  await category.deleteOne();

  res.json({ message: "Category deleted" });
});

// ============================================================
// SUBCATEGORY — CREATE
// ============================================================

/**
 * POST /api/categories/:slug/subcategories
 * Body: { name: "Mini Dresses" }
 * Admin only
 */
const createSubcategory = asyncHandler(async (req, res) => {
  const categorySlug = req.params.slug;
  const name = (req.body.name || "").trim();

  if (!name) {
    res.status(400);
    throw new Error("Subcategory name is required");
  }

  const parent = await Category.findOne({ slug: categorySlug });
  if (!parent) {
    res.status(404);
    throw new Error("Category not found");
  }

  const subSlug = slugify(name);
  if (!subSlug) {
    res.status(400);
    throw new Error("Could not create a valid slug from that name");
  }

  const exists = await Subcategory.findOne({
    category: categorySlug,
    slug: subSlug,
  });
  if (exists) {
    res.status(400);
    throw new Error("That subcategory already exists in this category");
  }

  const sub = await Subcategory.create({
    name,
    slug: subSlug,
    category: categorySlug,
  });

  res.status(201).json({
    name: sub.name,
    slug: sub.slug,
    category: sub.category,
  });
});

// ============================================================
// SUBCATEGORY — UPDATE (name only, slug stays)
// ============================================================

/**
 * PUT /api/categories/:slug/subcategories/:subSlug
 * Body: { name: "Mini" }
 * Admin only
 */
const updateSubcategory = asyncHandler(async (req, res) => {
  const categorySlug = req.params.slug;
  const subSlug = req.params.subSlug;
  const name = (req.body.name || "").trim();

  if (!name) {
    res.status(400);
    throw new Error("Subcategory name is required");
  }

  const sub = await Subcategory.findOne({
    category: categorySlug,
    slug: subSlug,
  });
  if (!sub) {
    res.status(404);
    throw new Error("Subcategory not found");
  }

  const duplicate = await Subcategory.findOne({
    category: categorySlug,
    slug: { $ne: subSlug },
    name: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
  });
  if (duplicate) {
    res.status(409);
    throw new Error(
      "Another subcategory in this category already uses this name",
    );
  }

  sub.name = name;
  await sub.save();

  res.json({
    name: sub.name,
    slug: sub.slug,
    category: sub.category,
  });
});

// ============================================================
// SUBCATEGORY — DELETE
// ============================================================

/**
 * DELETE /api/categories/:slug/subcategories/:subSlug
 * Admin only
 * Blocked if any product still uses this subcategory.
 */
const deleteSubcategory = asyncHandler(async (req, res) => {
  const categorySlug = req.params.slug;
  const subSlug = req.params.subSlug;

  const sub = await Subcategory.findOne({
    category: categorySlug,
    slug: subSlug,
  });
  if (!sub) {
    res.status(404);
    throw new Error("Subcategory not found");
  }

  // Guard: products still on this sub (and parent category)
  const productCount = await Product.countDocuments({
    category: categorySlug,
    subcategory: subSlug,
  });
  if (productCount > 0) {
    res.status(400);
    throw new Error(
      `Cannot delete this subcategory — ${productCount} product(s) still use it.`,
    );
  }

  await sub.deleteOne();

  res.json({ message: "Subcategory deleted" });
});

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
