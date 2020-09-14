const express = require('express');
const router = express.Router();

const MerchantController = require('../controllers/merchantController');
const staffController = require('../controllers/staffController');
const kioskController = require('../controllers/kioskController');

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
router.get('/staff/:staffId', staffController.retrieveStaff);
router.get('/staff/retrieveAllStaff', staffController.retrieveAllStaff);
router.put('/staff/:staffId/edit', staffController.updateStaff);
router.put('/staff/:staffId', staffController.disableStaff);

module.exports = router;