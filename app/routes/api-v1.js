const express = require('express');
const router = express.Router();
const crypto = require('crypto');

const Upload = require('../middleware/upload');

const CategoryController = require('../controllers/categoryController');
const CustomerController = require('../controllers/customerController');
const KioskController = require('../controllers/kioskController');
const MerchantController = require('../controllers/merchantController');
const StaffController = require('../controllers/staffController');

//Category
router.post('/category', CategoryController.createCategory);
router.get('/category/:id', CategoryController.retrieveCategory);
router.get('/categories', CategoryController.retrieveAllCategory);
router.put('/category/:id', CategoryController.updateCategory);
router.delete('/category/:id', CategoryController.deleteCategory);

//Customer
router.post('/customer', CustomerController.registerCustomer);
router.get('/customer/:id', CustomerController.retrieveCustomer);
router.get('/customers', CustomerController.retrieveAllCustomers);
router.post('/customer/email', CustomerController.retrieveCustomerByEmail);
router.put('/customer/:id', CustomerController.updateCustomer);
router.put('/customer/:id/toggleDisable', CustomerController.toggleDisableCustomer);
router.put('/customer/:id/activate', CustomerController.activateCustomer);
router.post('/customer/login', CustomerController.loginCustomer);
router.post('/customer/:id/verifyPassword', CustomerController.verifyCurrentPassword);
router.put('/customer/changePassword', CustomerController.changePassword);
router.post('/customer/forgotPassword', CustomerController.sendResetPasswordEmail);
router.post('/customer/resetPassword/checkValidToken', CustomerController.checkValidToken);
router.post('/customer/resetPassword', CustomerController.resetPassword);
router.post('/customer/sendOtp', CustomerController.sendOtp);
router.post('/customer/verifyOtp', CustomerController.verifyOtp);

//Kiosk
router.post('/kiosk', KioskController.createKiosk);
router.get('/kiosk/:id', KioskController.retrieveKiosk);
router.get('/kiosks', KioskController.retrieveAllKiosks);
router.put('/kiosk/:id', KioskController.updateKiosk);
router.put('/kiosk/:id/toggleDisable', KioskController.toggleDisableKiosk);
router.delete('/kiosk/:id', KioskController.deleteKiosk);

// Merchant
router.post('/merchant', MerchantController.registerMerchant);
router.get('/merchant/:id', MerchantController.retrieveMerchant);
router.post('/merchant/email', MerchantController.retrieveMerchantByEmail);
router.get('/merchants', MerchantController.retrieveAllMerchants);
router.put('/merchant/:id', MerchantController.updateMerchant);
router.put('/merchant/:id/toggleDisable', MerchantController.toggleDisableMerchant);
router.put('/merchant/:id/approve', MerchantController.approveMerchant);
router.post('/merchant/login', MerchantController.loginMerchant);
router.put('/merchant/:id/changePassword', MerchantController.changePassword);
router.post('/merchant/:id/uploadTenancyAgreement', Upload.preUploadCheck, MerchantController.uploadTenancyAgreement);
router.post('/merchant/forgotPassword', MerchantController.sendResetPasswordEmail);
router.post('/merchant/resetPassword/checkValidToken', MerchantController.checkValidToken);
router.post('/merchant/resetPassword', MerchantController.resetPassword);

//Staff
router.post('/staff', StaffController.registerStaff);
router.get('/staff/:id', StaffController.retrieveStaff);
router.post('/staff/email', StaffController.retrieveStaffByEmail);
router.get('/staff', StaffController.retrieveAllStaff);
router.put('/staff/:id', StaffController.updateStaff);
router.put('/staff/:id/toggleDisable', StaffController.toggleDisableStaff);
router.post('/staff/login', StaffController.loginStaff);
router.post('/staff/:id/changePassword', StaffController.changePassword);
router.post('/staff/forgotPassword', StaffController.sendResetPasswordEmail);
router.post('/staff/resetPassword/checkValidToken', StaffController.checkValidToken);
router.post('/staff/resetPassword', StaffController.resetPassword);

module.exports = router;