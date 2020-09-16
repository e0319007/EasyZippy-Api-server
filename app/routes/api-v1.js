const express = require('express');
const router = express.Router();

const AdvertisementController = require('../controllers/advertisementController');
const CustomerController = require('../controllers/customerController');
const KioskController = require('../controllers/kioskController');
const MerchantController = require('../controllers/merchantController');
const StaffController = require('../controllers/staffController');

//Advertisement
router.post('/createAdvertisementAsStaff', AdvertisementController.createAdvertisementAsStaff);
router.post('/createAdvertisementAsMerchant', AdvertisementController.createAdvertisementAsMerchant);
router.post('/createAdvertisementAsMerchantWithoutAccount', AdvertisementController.createAdvertisementAsMerchantWithoutAccount);
router.get('/advertisement/:id', AdvertisementController.retrieveAdvertisementById);
router.get('/advertisement/merchant/:id', AdvertisementController.retrieveAdvertisementByMerchantId);
router.get('/advertisement/staff/:id', AdvertisementController.retrieveAdvertisementByStaffId);
router.get('/advertisements', AdvertisementController.retrieveAllAdvertisement);
router.put('/advertisement/:id', AdvertisementController.updateAdvertisement);
router.put('/advertisement/:id/approve', AdvertisementController.toggleApproveAdvertisement);
router.put('/advertisement/:id/expire', AdvertisementController.setExpireAdvertisement);
router.delete('/advertisement/:id', AdvertisementController.deleteAdvertisement);

//Customer
router.post('/customer', CustomerController.registerCustomer);
router.get('/customer/:id', CustomerController.retrieveCustomer);
router.get('/customers', CustomerController.retrieveAllCustomers);
router.put('/customer/:id', CustomerController.updateCustomer);
router.put('/customer/:id/disable', CustomerController.disableCustomer);
router.put('/customer/:id/activate', CustomerController.activateCustomer);
router.post('/customer/login', CustomerController.loginCustomer);

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
router.get('/merchants', MerchantController.retrieveAllMerchants);
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