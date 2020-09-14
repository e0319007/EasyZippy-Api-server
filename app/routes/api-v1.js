const express = require('express');
const router = express.Router();

const staffController = require('../controllers/staffController');
const customerController = require('../controllers/customerController');

//Customer
router.post('/customer', customerController.registerCustomer);
router.get('/customer/:id', customerController.retrieveCustomer);
router.get('/customers', customerController.retrieveAllCustomer);
router.put('/customer/:id', customerController.updateCustomer);
router.put('/customer/:id/disable', customerController.disableCustomer);
router.put('/customer/:id/activate', customerController.activateCustomer);

//Staff
router.post('/staff', staffController.registerStaff);
router.get('/staff/:id', staffController.retrieveStaff);
router.get('/staff', staffController.retrieveAllStaff);
router.put('/staff/:id', staffController.updateStaff);
router.put('/staff/:id/toggleDisable', staffController.toggleDisableStaff);

module.exports = router;