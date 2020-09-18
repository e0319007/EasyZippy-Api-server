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

  retrieveCustomerByEmail: async(req, res) => {
    try {
      const { email } = req.body;
      const customer = await CustomerService.retrieveCustomerByEmail(email);
      return res.status(200).send(customer);
    } catch (err) {
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
      const { email, newPassword } = req.body;
      let customer;
      await sequelize.transaction(async (transaction) => {
        customer = await CustomerService.changePassword(email, newPassword, transaction)
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

  sendResetPasswordEmail: async (req, res) => {
    try {
      const { email } = req.body;
      await CustomerService.sendResetPasswordEmail(email);
      return res.status(200).send();
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  checkValidToken: async (req, res) => {
    try {
      const { email, token } = req.body;
      await CustomerService.checkValidToken(token, email);
      return res.status(200).send();
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email, token, newPassword } = req.body;
      let customer;
      await sequelize.transaction(async (transaction) => {
        customer = await CustomerService.resetPassword(email, token, newPassword, transaction);
      });
      return res.status(200).send(customer);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  sendOtp: async (req, res) => {
    try {
      const { email, password, mobile } = req.body;

      await sequelize.transaction(async (transaction) => {
        customer = await CustomerService.sendOtp(mobile, email, password, transaction);
      });
      return res.status(200).send();
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const { otp, email, password } = req.body;
      
      await sequelize.transaction(async (transaction) => {
        await CustomerService.verifyOtp(otp, email, password, transaction);
      });
      return res.status(200).send();
    } catch (err) {
      console.log(err)
    }
  },

  loginWithFacebook: async(req, res) => {
    try {
      let token = CustomerService.loginWithFacebook();
      return res.status(200).send(token);
    } catch (err) {
  
      sendErrorResponse(res, err);
    }
  }
};