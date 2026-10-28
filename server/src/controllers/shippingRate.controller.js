const ShippingRate = require('../models/shippingRate');
const asyncHandler = require('../middleware/asyncHandler');

// GET /api/shipping/rates
// Public: active only (checkout dropdown)
// ?all=true: everything (admin table)
const getRates = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { active: true };
  const rates = await ShippingRate.find(filter).sort({ countryName: 1 });
  res.status(200).json(rates);
});

// GET /api/shipping/quote/:countryCode
const getQuote = asyncHandler(async (req, res) => {
  const code = req.params.countryCode.toUpperCase();

  const rate = await ShippingRate.findOne({
    countryCode: code,
    active: true,
  });

  if (!rate) {
    res.status(404);
    throw new Error('Shipping is not available for this country.');
  }

  res.status(200).json({
    countryCode: rate.countryCode,
    countryName: rate.countryName,
    standard: rate.standard,
    express: rate.express,
  });
});

// POST /api/shipping/rates  — admin adds a country + rates
const createRate = asyncHandler(async (req, res) => {
  const { countryCode, countryName, standard, express, active } = req.body;

  if (!countryCode?.trim() || !countryName?.trim()) {
    res.status(400);
    throw new Error('countryCode and countryName are required.');
  }

  const code = countryCode.toUpperCase().trim();

  const exists = await ShippingRate.findOne({ countryCode: code });
  if (exists) {
    res.status(400);
    throw new Error('This country already has a shipping rate.');
  }

  const rate = await ShippingRate.create({
    countryCode: code,
    countryName: countryName.trim(),
    standard: Number(standard) || 0,
    express: Number(express) || 0,
    active: active !== false,
  });

  res.status(201).json(rate);
});

// PUT /api/shipping/rates/:id  — admin edits
const updateRate = asyncHandler(async (req, res) => {
  const rate = await ShippingRate.findById(req.params.id);

  if (!rate) {
    res.status(404);
    throw new Error('Shipping rate not found.');
  }

  if (req.body.countryName != null) {
    rate.countryName = String(req.body.countryName).trim();
  }
  if (req.body.standard != null) {
    rate.standard = Number(req.body.standard);
  }
  if (req.body.express != null) {
    rate.express = Number(req.body.express);
  }
  if (req.body.active != null) {
    rate.active = Boolean(req.body.active);
  }
  if (req.body.countryCode != null) {
    rate.countryCode = String(req.body.countryCode).toUpperCase().trim();
  }

  await rate.save();
  res.status(200).json(rate);
});

// DELETE /api/shipping/rates/:id
const deleteRate = asyncHandler(async (req, res) => {
  const rate = await ShippingRate.findById(req.params.id);

  if (!rate) {
    res.status(404);
    throw new Error('Shipping rate not found.');
  }

  await rate.deleteOne();
  res.status(200).json({ message: 'Shipping rate removed.' });
});

module.exports = {
  getRates,
  getQuote,
  createRate,
  updateRate,
  deleteRate,
};