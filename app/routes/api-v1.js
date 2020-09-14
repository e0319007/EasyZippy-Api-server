const express = require('express');
const router = express.Router();

const MerchantController = require('../controllers/merchantController');
const staffController = require('../controllers/staffController');

// Merchant
router.post('/merchant', MerchantController.registerMerchant);

//Staff
router.post('/staff', staffController.registerStaff);
router.get('/staff/:id', staffController.retrieveStaff);
router.get('/staff', staffController.retrieveAllStaff);
router.put('/staff/:id', staffController.updateStaff);
router.put('/staff/:id/toggleDisable', staffController.toggleDisableStaff);

module.exports = router;