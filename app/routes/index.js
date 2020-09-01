const express = require('express');
const router = express.Router();
const api = require('./api-v1');

router.use('/api/v1', api);

module.exports = router;