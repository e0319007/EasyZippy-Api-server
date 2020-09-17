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

  retrieveAllCustomers: async (req, res) => {
    try {
        let customers = await CustomerService.retrieveAllCustomers();
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
        console.log(err);
        sendErrorResponse(res, err);
       
    }
  },
  
  toggleDisableCustomer: async (req, res) => {
    try {
        const { id } = req.params;
        let customer;
        await sequelize.transaction(async (transaction) => {
            customer = await CustomerService.toggleDisableCustomer(id, transaction)
        });
        return res.status(200).send(customer);
    } catch (err){
        console.log(err);
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
  },

  loginCustomer: async (req, res) => {
    try {
      const { email, password } = req.body;

      const { customer, token } = await CustomerService.loginCustomer(email, password);

      return res.status(200).send({ customer, token });
    } catch (err) {
      sendErrorResponse(res, err, 401);
    }
  },

  verifyCurrentPassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { currentPassword } = req.body;

      const verified = await CustomerService.verifyCurrentPassword(id, currentPassword);

      return res.status(200).send({ verified });
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  changePassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      let customer;
      await sequelize.transaction(async (transaction) => {
        customer = await CustomerService.changePassword(id, newPassword, transaction)
      });
      return res.status(200).send(customer);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },
  
  retrieveCustomerByEmail: async (req, res) => {
    try {
      const { email } = req.body;
      let customer;
      await sequelize.transaction(async (transaction) => {
        customer = await CustomerService.retrieveCustomerByEmail(email, transaction)
      });
      return res.status(200).send(customer);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email } = req.body.email;
      CustomerService.resetPassword(email);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }

  
};