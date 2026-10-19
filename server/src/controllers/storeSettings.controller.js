const StoreSettings = require("../models/storeSettings");
const asyncHandler = require("../middleware/asyncHandler");

const getSettings = asyncHandler(async (req, res) => {

  let doc = await StoreSettings.findOne();

  if (!doc) {
    doc = await StoreSettings.create({});
  }

  res.status(200).json({ settings: doc });
});


const updateSettings = asyncHandler(async (req, res) => {
  let doc = await StoreSettings.findOne();

  if (!doc) {
    doc = await StoreSettings.create({});
  }

  // Only copy fields we allow (avoids clients sending random keys)
  const fields = [
    'storeName',
    'storeEmail',
    'storePhone',
    'storeDescription',
    'storeAddress',
    'announcementBar',
    'storeActive',
    'guestCheckout',
    'shippingNotice',
  ];

  for (const key of fields) {
    if (req.body[key] === undefined) continue;

    if (typeof req.body[key] === 'string') {
      doc[key] = req.body[key].trim();
    } else {
      doc[key] = req.body[key];
    }
  }

  // Catalog base stays USD at this stage
  doc.baseCurrency = 'USD';

  // Sensible fallback if name cleared
  if (!doc.storeName) {
    doc.storeName = 'Sissy Glams';
  }

  await doc.save();

  res.status(200).json({ settings: doc });
});

module.exports = {
    getSettings,
    updateSettings
}
