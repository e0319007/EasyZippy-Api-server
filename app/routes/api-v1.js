const express = require('express');
const router = express.Router();

const MerchantController = require('../controllers/merchantController');
const staffController = require('../controllers/staffController');
const kioskController = require('../controllers/kioskController');

//Category
router.post('/category', categoryController.createCategory);
router.get('/category/:id', categoryController.retrieveCategory);
router.get('/categories', categoryController.retrieveAllCategory);
router.put('/category/:id', categoryController.updateCategory);
router.delete('/category/:id', categoryController.deleteCategory);

//Kiosk
router.post('/kiosk', kioskController.createKiosk);
router.get('/kiosk/:id', kioskController.createKiosk);
router.get('/kiosk/retrieveAllKiosk', kioskController.createKiosk);
router.put('/kiosk/:id', kioskController.createKiosk);
router.put('/kiosk/:id/disable', kioskController.createKiosk);
router.delete('/kiosk/:id', kioskController.createKiosk);

// Merchant
router.post('/merchant', MerchantController.registerMerchant);

//Staff
router.post('/staff', staffController.registerStaff);
router.get('/staff/:id', staffController.retrieveStaff);
router.get('/staff/retrieveAllStaff', staffController.retrieveAllStaff);
router.put('/staff/:id', staffController.updateStaff);
router.put('/staff/:id/disable', staffController.disableStaff);

module.exports = router;