const sequelize = require('../common/database');
const { sendErrorResponse } = require('../common/error/errorHandler');
const CustomerService = require('../services/customerService');

module.exports = {
   registerCustomer: async (req, res) => {
    try {
        const customerData = req.body;
        let customer;

        await sequelize.transaction(async (transaction) => {
            customer = await CustomerService.createCustomer(customerData, transaction);
        });

        return res.status(200).send(customer);
    } catch (err) {
        sendErrorResponse(res, err);
    }
  },

  retrieveCustomer: async (req, res) => {
    try {
        const { id } = req.params;
        let customer = await CustomerService.retrieveCustomer(id);
        return res.status(200).send(customer);
    } catch (err){
        sendErrorResponse(res, err);
    }
  },

  retrieveAllCustomer: async (req, res) => {
    try {
        let customers = await CustomerService.retrieveAllCustomer();
        return res.status(200).send(customers);
    } catch (err){
        sendErrorResponse(res, err);
    }
  },

  updateCustomer: async (req, res) => {
    try {
        const customerData = req.body;
        const { id } = req.params;
        let customer;
        await sequelize.transaction(async (transaction) => {
            customer = await CustomerService.updateCustomer(id, customerData, transaction);
        });
        return res.status(200).send(customer);
    } catch (err){
        sendErrorResponse(res, err);
    }
  },
  
  disableCustomer: async (req, res) => {
    try {
        const { id } = req.params;
        let customer;
        await sequelize.transaction(async (transaction) => {
            customer = await CustomerService.disableCustomer(id, transaction)
        });
        return res.status(200).send(customer);
    } catch (err){
        sendErrorResponse(res, err);
    }
  }, 

  activateCustomer: async(req, res) => {
    try { 
        const { id } = req.params;
        let customer;  
        await sequelize.transaction(async (transaction) => {
            customer = await CustomerService.activateCustomer(id, transaction)
        });
        return res.status(200).send(customer);
    } catch (err){
         sendErrorResponse(res, err);
    }
  }
};