const emailValidator = require('email-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

const Helper = require('../common/helper');
const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');
const EmailHelper = require('../common/emailHelper')

const Customer = require('../models/Customer');

const retrieveCustomerByEmail = async(email) => {
  const customer = await Customer.findOne({ where : { email } });
  if (Checker.isEmpty(customer)) {
    throw new CustomError(Constants.Error.CustomerNotFound);
  } else {
    return customer;
  }
};

const changePasswordForResetPassword = async(id, newPassword, transaction) => {
  Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
  Checker.ifEmptyThrowError(newPassword, Constants.Error.NewPasswordRequired);

  let customer = await Customer.findByPk(id);

  Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);

  if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/).test(newPassword)) {
    throw new CustomError(Constants.Error.PasswordWeak);
  }

  newPassword = await Helper.hashPassword(newPassword);

  customer = await customer.update({
    password: newPassword
  }, {
    where: { id },
    returning: true,
    transaction
  });
  return customer;
};

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

        if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/).test(password)) {
          throw new CustomError(Constants.Error.PasswordWeak);
        }

        //OTP
    
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

      if(updateKeys.includes('password')) {
        throw new CustomError(Constants.Error.PasswordCannotChange);
      }
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
  
  toggleDisableCustomer: async(id, transaction) => {
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

      if (curCustomer.disabled) {
        throw new CustomError(Constants.Error.CustomerDisabled);
      }
      
      let customer = Customer.update({
          activated: !curCustomer.activated
      }, {
          where : {
          id
          }
      , returning: true, transaction });
      return customer;
  },

  loginCustomer: async(email, password) => {
    Checker.ifEmptyThrowError(email, Constants.Error.EmailRequired);
    Checker.ifEmptyThrowError(password, Constants.Error.PasswordRequired);

    const customer = await Customer.findOne({ where: { email } });

    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);

    if (customer.disabled) {
      throw new CustomError(Constants.Error.CustomerDisabled)
    }

    if (!(await Helper.comparePassword(password, customer.password))) {
      throw new CustomError(Constants.Error.PasswordIncorrect);
    };

    if (!customer.activated) {
      // To add trigger for 2FA
      throw new CustomError(Constants.Error.CustomerNotActivated);
    }

    const token = jwt.sign(
      {
        id: customer.id,
        accountType: Constants.AccountType.Customer
      },
      config.get('jwt.private_key'),
      { expiresIn: '1d' }
    );

    return { customer, token };
  },

  verifyCurrentPassword: async(id, currentPassword) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(currentPassword, Constants.Error.CurrentPasswordRequired);

    let customer = await Customer.findByPk(id);

    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);

    if (!(await Helper.comparePassword(currentPassword, customer.password))) {
      throw new CustomError(Constants.Error.PasswordIncorrect);
    }

    return true;
  },

  changePassword: async(id, newPassword, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(newPassword, Constants.Error.NewPasswordRequired);

    let customer = await Customer.findByPk(id);

    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);

    if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/).test(newPassword)) {
      throw new CustomError(Constants.Error.PasswordWeak);
    }

    newPassword = await Helper.hashPassword(newPassword);

    customer = await customer.update({
      password: newPassword
    }, {
      where: { id },
      returning: true,
      transaction
    });
    return customer;
  },

  sendResetPasswordEmail: async(email, host) => {
    try{
    let customer = await retrieveCustomerByEmail(email);
    } catch (err) {
      throw new CustomError(Constants.Error.CustomerNotFoundWithEmail);
    }
    let token = await EmailHelper.generateToken();
    let resetPasswordExpires = Date.now() + 3600000; //1h

    customer = await Customer.update({
      resetPasswordToken: token,
      resetPasswordExpires
    }, {
      where: {
        email
      }
    });
    
    await EmailHelper.sendEmail(email, token, host);
  },

  checkValidToken: async(token, email) => {
    Checker.ifEmptyThrowError(email, Constants.Error.EmailRequired);
    Checker.ifEmptyThrowError(token, );
    let customer = await Customer.findOne({
      where: {
        resetPasswordToken: token,
        email
      }
    });
    Checker.ifEmptyThrowError(customer, Constants.Error.TokenNotFound);
  },

  resetPassword: async(token, password, transaction) => {
    let customer = await Customer.findOne({
      where: {
        resetPasswordToken: token
      }
    });
    Checker.ifEmptyThrowError(customer, Constants.Error.TokenNotFound)
    let id = customer.id;
    if(customer.resetPasswordExpires < Date.now()) {
      throw new CustomError(Constants.Error.TokenExpired);
    } else {
      customer = await changePasswordForResetPassword(id, password, transaction);
    }
    return customer
  },

  retrieveCustomerByEmail
}

