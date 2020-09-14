const express = require('express');
const router = express.Router();

const MerchantController = require('../controllers/merchantController');
const staffController = require('../controllers/staffController');
const kioskController = require('../controllers/kioskController');
const categoryController = require('../controllers/categoryController');

//Kiosk
router.post('/kiosk', kioskController.createKiosk);
router.get('/kiosk/:id', kioskController.retrieveKiosk);
router.get('/kiosks', kioskController.retrieveAllKiosk);
router.put('/kiosk/:id', kioskController.updateKiosk);
router.put('/kiosk/:id/disable', kioskController.disableKiosk);
router.delete('/kiosk/:id', kioskController.deleteKiosk);

// Merchant
router.post('/merchant', MerchantController.registerMerchant);

//Staff
router.post('/staff', staffController.registerStaff);
router.get('/staff/:id', staffController.retrieveStaff);
router.get('/staff/retrieveAllStaff', staffController.retrieveAllStaff);
router.put('/staff/:id', staffController.updateStaff);
router.put('/staff/:id/disable', staffController.disableStaff);

module.exports = router;