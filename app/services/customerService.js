const emailValidator = require('email-validator');

const Helper = require('../common/helper');
const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');

const Customer = require('../models/Customer');

module.exports = {
    createCustomer: async(customerData, transaction) => {
        const {firstName, lastName, mobileNumber, password, email} = customerData;
        Checker.ifEmptyThrowError(firstName, Constants.Error.NameRequired);
        Checker.ifEmptyThrowError(lastName, Constants.Error.NameRequired);
        Checker.ifEmptyThrowError(mobileNumber, Constants.Error.MobileNumberRequired);
        Checker.ifEmptyThrowError(password, Constants.Error.PasswordRequired);
        Checker.ifEmptyThrowError(email, Constants.Error.EmailRequired);

        if(!emailValidator.validate(email)) {
            throw new CustomError(Constants.Error.EmailInvalid);
          }
          if(!Checker.isEmpty(await Customer.findOne({ where: { mobileNumber } }))) {
            throw new CustomError(Constants.Error.MobileNumberNotUnique);
          }
          if(!Checker.isEmpty(await Customer.findOne({ where: { email } }))) {
            throw new CustomError(Constants.Error.EmailNotUnique);
          }
      
          customerData.password = await Helper.hashPassword(password);
      
          const customer = await Customer.create(customerData, { transaction });
      
          return customer;
    },

    retrieveCustomer: async (id) => {
        const customer = await Customer.findByPk(id);
        
        if (Checker.isEmpty(customer)) {
          throw new CustomError(Constants.Error.CustomerNotFound);
        } else {
          return customer;
        }
      },
    
    retrieveAllCustomers: async () => {
        const customers = await Customer.findAll();
        return customers;
    },
    
    updateCustomer: async(id, customerData, transaction) => {
        Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
        let customer = await Customer.findByPk(id);
        Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);

        const updateKeys = Object.keys(customerData);

        if(updateKeys.includes('firstName')) {
            Checker.ifEmptyThrowError(customerData.firstName, Constants.Error.FirstNameRequired);
        }
        if(updateKeys.includes('lastName')) {
            Checker.ifEmptyThrowError(customerData.lastName, Constants.Error.LastNameRequired);
        }
        if(updateKeys.includes('mobileNumber')) {
            Checker.ifEmptyThrowError(customerData.mobileNumber, Constants.Error.MobileNumberRequired);
            if(!Checker.isEmpty(await Customer.findOne({ where: { mobileNumber } }))) {
            throw new CustomError(Constants.Error.MobileNumberNotUnique);
            }
        }
        if(updateKeys.includes('email')) {
            Checker.ifEmptyThrowError(customerData.email, Constants.Error.EmailRequired);
            if (!Checker.isEmpty(await Customer.findOne({ where: { email } }))) {
            throw new CustomError(Constants.Error.EmailNotUnique);
            }
            if (!emailValidator.validate(customerData.email)) {
            throw new CustomError(Constants.Error.InvalidEmail);
            }
        }
        customer = await Customer.update(customerData, { where : { id }, returning: true, transaction });
        return customer;
    },
    
    disableCustomer: async(id, transaction) => {
        const curCustomer = await Customer.findByPk(id);
        Checker.ifEmptyThrowError(curCustomer, Constants.Error.CustomerNotFound);
        
        let customer = Customer.update({
            disabled: !curCustomer.disabled
        }, { where : { id }, returning: true, transaction });
        return customer;
    },

    activateCustomer: async(id, transaction) => {
        const curCustomer = await Customer.findByPk(id);
        Checker.ifEmptyThrowError(curCustomer, Constants.Error.CustomerNotFound);
        
        let customer = Customer.update({
            activated: !curCustomer.activated
        }, {
            where : {
            id
            }
        , returning: true, transaction });
        return customer;
    }
}
