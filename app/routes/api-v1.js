const express = require('express');
const router = express.Router();

const MerchantController = require('../controllers/merchantController');
const staffController = require('../controllers/staffController');

// Merchant
router.post('/merchant', MerchantController.registerMerchant);
router.get('/merchant/:id', MerchantController.retrieveMerchant);
router.get('/merchant/retrieveAllMerchant', MerchantController.retrieveAllMerchant);
router.put('/merchant/:id', MerchantController.updateMerchant);
router.put('/merchant/:id/disable', MerchantController.disableMerchant);
router.put('/merchant/:id/approve', MerchantController.approveMerchant);

//Staff
router.post('/staff', staffController.registerStaff);
router.get('/staff/:id', staffController.retrieveStaff);
router.get('/staff/retrieveAllStaff', staffController.retrieveAllStaff);
router.put('/staff/:id', staffController.updateStaff);
router.put('/staff/:id/disable', staffController.disableStaff);

module.exports = router;