const express = require('express');
const router = express.Router();

const staffController = require('../controllers/staffController');
const customerController = require('../controllers/customerController');
const MerchantController = require('../controllers/MerchantController');


//Customer
router.post('/customer', customerController.registerCustomer);
router.get('/customer/:id', customerController.retrieveCustomer);
router.get('/customers', customerController.retrieveAllCustomer);
router.put('/customer/:id', customerController.updateCustomer);
router.put('/customer/:id/disable', customerController.disableCustomer);
router.put('/customer/:id/activate', customerController.activateCustomer);


// Merchant
router.post('/merchant', MerchantController.registerMerchant);
router.get('/merchant/:id', MerchantController.retrieveMerchant);
router.get('/merchants', MerchantController.retrieveAllMerchant);
router.put('/merchant/:id', MerchantController.updateMerchant);
router.put('/merchant/:id/disable', MerchantController.disableMerchant);
router.put('/merchant/:id/approve', MerchantController.approveMerchant);

//Staff
router.post('/staff', staffController.registerStaff);
router.get('/staff/:id', staffController.retrieveStaff);
router.get('/staff', staffController.retrieveAllStaff);
router.put('/staff/:id', staffController.updateStaff);
router.put('/staff/:id/toggleDisable', staffController.toggleDisableStaff);

module.exports = router;