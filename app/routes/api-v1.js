const express = require('express');
const router = express.Router();

const MerchantController = require('../controllers/merchantController');

// Merchant
router.post('/merchant', MerchantController.registerMerchant);

module.exports = router;