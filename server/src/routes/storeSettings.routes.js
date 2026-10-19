const express = require('express');
const router = express.Router();

const { getSettings, updateSettings } = require('../controllers/storeSettings.controller');
const {adminOnly, protect} = require('../middleware/authMiddleware')


router.get('/', getSettings);
router.put('/', protect, adminOnly, updateSettings);



module.exports = router