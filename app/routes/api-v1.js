const express = require('express');
const router = express.Router();
const Authenticator = require('../middleware/authenticator');
const Upload = require('../middleware/upload');

const CategoryController = require('../controllers/categoryController');
const CustomerController = require('../controllers/customerController');
const KioskController = require('../controllers/kioskController');
const MerchantController = require('../controllers/merchantController');
const StaffController = require('../controllers/staffController');

//Category
router.post('/category', Authenticator.staffOnly, CategoryController.createCategory);
router.get('/category/:id', Authenticator.customerAndMerchantAndStaffOnly, CategoryController.retrieveCategory);
router.get('/categories', Authenticator.customerAndMerchantAndStaffOnly, CategoryController.retrieveAllCategory);
router.put('/category/:id',  Authenticator.staffOnly, CategoryController.updateCategory);
router.delete('/category/:id', Authenticator.staffOnly, CategoryController.deleteCategory);

//Customer
router.post('/customer', CustomerController.registerCustomer);
router.get('/customer/:id', Authenticator.customerAndMerchantAndStaffOnly, CustomerController.retrieveCustomer);
router.get('/customers', Authenticator.customerAndMerchantAndStaffOnly, CustomerController.retrieveAllCustomers);
router.put('/customer/changePassword', Authenticator.customerOnly, CustomerController.changePassword);
router.put('/customer/:id', Authenticator.customerOnly, CustomerController.updateCustomer);
router.put('/customer/:id/toggleDisable', Authenticator.staffOnly, CustomerController.toggleDisableCustomer);
router.put('/customer/:id/activate',  Authenticator.customerOnly, CustomerController.activateCustomer);
router.post('/customer/login', CustomerController.loginCustomer);
router.post('/customer/email', Authenticator.customerAndMerchantAndStaffOnly, CustomerController.retrieveCustomerByEmail);
router.post('/customer/:id/verifyPassword', Authenticator.customerOnly, CustomerController.verifyCurrentPassword);
router.post('/customer/forgotPassword', Authenticator.customerOnly, CustomerController.sendResetPasswordEmail);
router.post('/customer/resetPassword/checkValidToken', Authenticator.customerOnly, CustomerController.checkValidToken);
router.post('/customer/resetPassword', CustomerController.resetPassword);
router.post('/customer/sendOtp', CustomerController.sendOtp);
router.post('/customer/verifyOtp', CustomerController.verifyOtp);

//Kiosk
router.post('/kiosk', Authenticator.staffOnly, KioskController.createKiosk);
router.get('/kiosk/:id', Authenticator.staffOnly, KioskController.retrieveKiosk);
router.get('/kiosks', Authenticator.staffOnly, KioskController.retrieveAllKiosks);
router.put('/kiosk/:id', Authenticator.staffOnly, KioskController.updateKiosk);
router.put('/kiosk/:id/toggleDisable', Authenticator.staffOnly, KioskController.toggleDisableKiosk);
router.delete('/kiosk/:id', Authenticator.staffOnly, KioskController.deleteKiosk);

// Merchant
router.post('/merchant', MerchantController.registerMerchant);
router.get('/merchant/:id', Authenticator.customerAndMerchantAndStaffOnly, MerchantController.retrieveMerchant);
router.post('/merchant/email', Authenticator.customerAndMerchantAndStaffOnly, MerchantController.retrieveMerchantByEmail);
router.get('/merchants', Authenticator.customerAndMerchantAndStaffOnly, MerchantController.retrieveAllMerchants);
router.put('/merchant/:id/toggleDisable', Authenticator.merchantOnly, MerchantController.toggleDisableMerchant);
router.put('/merchant/:id/approve', Authenticator.staffOnly, MerchantController.approveMerchant);
router.put('/merchant/:id/changePassword', Authenticator.merchantOnly, MerchantController.changePassword);
router.put('/merchant/:id', Authenticator.merchantOnly, MerchantController.updateMerchant);
router.post('/merchant/login', MerchantController.loginMerchant);
router.post('/merchant/:id/uploadTenancyAgreement', Upload.preUploadCheck, MerchantController.uploadTenancyAgreement);
router.post('/merchant/forgotPassword', Authenticator.merchantOnly, MerchantController.sendResetPasswordEmail);
router.post('/merchant/resetPassword/checkValidToken', MerchantController.checkValidToken);
router.post('/merchant/resetPassword', MerchantController.resetPassword);

//Staff
router.post('/staff', Authenticator.staffOnly, StaffController.registerStaff);
router.get('/staff/:id', Authenticator.staffOnly, StaffController.retrieveStaff);
router.post('/staff/email', Authenticator.staffOnly, StaffController.retrieveStaffByEmail);
router.get('/staff', Authenticator.staffOnly, StaffController.retrieveAllStaff);
router.put('/staff/:id/changePassword', Authenticator.staffOnly, StaffController.changePassword);
router.put('/staff/:id', Authenticator.staffOnly, StaffController.updateStaff);
router.put('/staff/:id/toggleDisable', Authenticator.staffOnly, StaffController.toggleDisableStaff);
router.post('/staff/login', StaffController.loginStaff);
router.post('/staff/forgotPassword', StaffController.sendResetPasswordEmail);
router.post('/staff/resetPassword/checkValidToken', StaffController.checkValidToken);
router.post('/staff/resetPassword', StaffController.resetPassword);

module.exports = router;