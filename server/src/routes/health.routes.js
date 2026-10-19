const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    ok: true,
    service: 'sissy-glams-api',
    time: new Date().toISOString(),
  });
});

module.exports = router;