const express = require('express');
const router = express.Router();

const Upload = require('../middleware/upload');

const CategoryController = require('../controllers/categoryController');
const CustomerController = require('../controllers/customerController');
const KioskController = require('../controllers/kioskController');
const MerchantController = require('../controllers/merchantController');
const StaffController = require('../controllers/staffController');

//Category
router.get('/categories', CategoryController.retrieveAllCategory);
router.get('/category/:id', CategoryController.retrieveCategory);
router.post('/category', CategoryController.createCategory);
router.put('/category/:id', CategoryController.updateCategory);
router.delete('/category/:id', CategoryController.deleteCategory);

//Customer
router.get('/customer/:id', CustomerController.retrieveCustomer);
router.get('/customers', CustomerController.retrieveAllCustomers);
router.post('/customer/email', CustomerController.retrieveCustomerByEmail);
router.post('/customer/login', CustomerController.loginCustomer);
router.post('/customer/forgotPassword', CustomerController.sendResetPasswordEmail);
router.post('/customer/verifyOtp', CustomerController.verifyOtp);
router.post('/customer/resetPassword/checkValidToken', CustomerController.checkValidToken);
router.post('/customer/resetPassword', CustomerController.resetPassword);
router.post('/customer/sendOtp', CustomerController.sendOtp);
router.post('/customer', CustomerController.registerCustomer);
router.post('/customer/:id/verifyPassword', CustomerController.verifyCurrentPassword);
router.put('/customer/changePassword', CustomerController.changePassword);
router.put('/customer/:id/toggleDisable', CustomerController.toggleDisableCustomer);
router.put('/customer/:id/activate', CustomerController.activateCustomer);
router.put('/customer/:id', CustomerController.updateCustomer);

//Kiosk


router.get('/kiosks', KioskController.retrieveAllKiosks);
router.get('/kiosk/:id', KioskController.retrieveKiosk);
router.post('/kiosk', KioskController.createKiosk);
router.put('/kiosk/:id/toggleDisable', KioskController.toggleDisableKiosk);
router.put('/kiosk/:id', KioskController.updateKiosk);
router.delete('/kiosk/:id', KioskController.deleteKiosk);

// Merchant
router.get('/merchants', MerchantController.retrieveAllMerchants);
router.get('/merchant/:id', MerchantController.retrieveMerchant);
router.post('/merchant/email', MerchantController.retrieveMerchantByEmail);
router.post('/merchant/login', MerchantController.loginMerchant);
router.post('/merchant', MerchantController.registerMerchant);
router.post('/merchant/forgotPassword', MerchantController.sendResetPasswordEmail);
router.post('/merchant/resetPassword/checkValidToken', MerchantController.checkValidToken);
router.post('/merchant/resetPassword', MerchantController.resetPassword);
router.post('/merchant/:id/uploadTenancyAgreement', Upload.preUploadCheck, MerchantController.uploadTenancyAgreement);
router.put('/merchant/:id/toggleDisable', MerchantController.toggleDisableMerchant);
router.put('/merchant/:id/approve', MerchantController.approveMerchant);
router.put('/merchant/:id/changePassword', MerchantController.changePassword);
router.put('/merchant/:id', MerchantController.updateMerchant);

//Staff
router.get('/staff/:id', StaffController.retrieveStaff);
router.get('/staff', StaffController.retrieveAllStaff);
router.post('/staff/email', StaffController.retrieveStaffByEmail);
router.post('/staff/login', StaffController.loginStaff);
router.post('/staff/forgotPassword', StaffController.sendResetPasswordEmail);
router.post('/staff/resetPassword/checkValidToken', StaffController.checkValidToken);
router.post('/staff/resetPassword', StaffController.resetPassword);
router.post('/staff', StaffController.registerStaff);
router.post('/staff/:id/changePassword', StaffController.changePassword);
router.put('/staff/:id/toggleDisable', StaffController.toggleDisableStaff);
router.put('/staff/:id', StaffController.updateStaff);

module.exports = router;