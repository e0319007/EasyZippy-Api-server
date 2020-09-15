const express = require('express');
const router = express.Router();

const CustomerController = require('../controllers/customerController');
const MerchantController = require('../controllers/merchantController');
const StaffController = require('../controllers/staffController');

//Customer
router.post('/customer', CustomerController.registerCustomer);
router.get('/customer/:id', CustomerController.retrieveCustomer);
router.get('/customers', CustomerController.retrieveAllCustomer);
router.put('/customer/:id', CustomerController.updateCustomer);
router.put('/customer/:id/disable', CustomerController.disableCustomer);
router.put('/customer/:id/activate', CustomerController.activateCustomer);
router.post('/customer/login', CustomerController.loginCustomer);

// Merchant
router.post('/merchant', MerchantController.registerMerchant);
router.get('/merchant/:id', MerchantController.retrieveMerchant);
router.get('/merchants', MerchantController.retrieveAllMerchant);
router.put('/merchant/:id', MerchantController.updateMerchant);
router.put('/merchant/:id/disable', MerchantController.disableMerchant);
router.put('/merchant/:id/approve', MerchantController.approveMerchant);
router.post('/merchant/login', MerchantController.loginMerchant);

//Staff
router.post('/staff', StaffController.registerStaff);
router.get('/staff/:id', StaffController.retrieveStaff);
router.get('/staff', StaffController.retrieveAllStaff);
router.put('/staff/:id', StaffController.updateStaff);
router.put('/staff/:id/toggleDisable', StaffController.toggleDisableStaff);
router.post('/staff/login', StaffController.loginStaff);

module.exports = router;