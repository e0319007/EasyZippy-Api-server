const jwt = require('jsonwebtoken');
const config = require('config');

const Constants = require('../common/constants');
const Checker = require('../common/checker');
const CustomError = require('../common/error/customError');
const Customer = require('../models/Customer');
const Merchant = require('../models/Merchant');
const Staff = require('../models/Staff');

module.exports = {
  customerOnly: async (token) => {
    try {
      Checker.ifEmptyThrowError(token, Constants.Error.TokenRequired)

      const decodedToken = jwt.verify(token, config.get('jwt.private_key'));
      const customer = await Customer.findByPk(decodedToken.id);

      Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);
      if (decodedToken.accountType !== Constants.AccountType.Customer) {
        throw new CustomError(Constants.Error.UserUnauthorised);
      }

      return true;
    } catch (err) {
      return false;
    }
  },

  merchantOnly: async (token) => {
    try {
      Checker.ifEmptyThrowError(token, Constants.Error.TokenRequired)

      const decodedToken = jwt.verify(token, config.get('jwt.private_key'));
      const merchant = await Merchant.findByPk(decodedToken.id);

      Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);
      if (decodedToken.accountType !== Constants.AccountType.Merchant) {
        throw new CustomError(Constants.Error.UserUnauthorised);
      }

      return true;
    } catch (err) {
      return false;
    }
  },

  staffOnly: async (token) => {
    try {
      Checker.ifEmptyThrowError(token, Constants.Error.TokenRequired)

      const decodedToken = jwt.verify(token, config.get('jwt.private_key'));
      const staff = await Staff.findByPk(decodedToken.id);

      Checker.ifEmptyThrowError(staff, Constants.Error.StaffNotFound);
      if (decodedToken.accountType !== Constants.AccountType.Staff) {
        throw new CustomError(Constants.Error.UserUnauthorised);
      }

      return true;
    } catch (err) {
      return false;
    }
  },

  customerAndMerchantOnly: async (token) => {
    try {
      Checker.ifEmptyThrowError(token, Constants.Error.TokenRequired)

      const decodedToken = jwt.verify(token, config.get('jwt.private_key'));

      let user;
      if (decodedToken.accountType === Constants.AccountType.Customer) {
        user = await Customer.findByPk(decodedToken.id);
        Checker.ifEmptyThrowError(user, Constants.Error.CustomerNotFound);
      } else if (decodedToken.accountType === Constants.AccountType.Merchant) {
        user = await Merchant.findByPk(decodedToken.id);
        Checker.ifEmptyThrowError(user, Constants.Error.MerchantNotFound);
      } else {
        throw new CustomError(Constants.Error.UserUnauthorised);
      }

      return true;
    } catch (err) {
      return false;
    }
  },

  customerAndStaffOnly: async (token) => {
    try {
      Checker.ifEmptyThrowError(token, Constants.Error.TokenRequired)

      const decodedToken = jwt.verify(token, config.get('jwt.private_key'));

      let user;
      if (decodedToken.accountType === Constants.AccountType.Customer) {
        user = await Customer.findByPk(decodedToken.id);
        Checker.ifEmptyThrowError(user, Constants.Error.CustomerNotFound);
      } else if (decodedToken.accountType === Constants.AccountType.Staff) {
        user = await Staff.findByPk(decodedToken.id);
        Checker.ifEmptyThrowError(user, Constants.Error.StaffRoleRequired);
      } else {
        throw new CustomError(Constants.Error.UserUnauthorised);
      }

      return true;
    } catch (err) {
      return false;
    }
  },

  merchantAndStaffOnly: async (token) => {
    try {
      Checker.ifEmptyThrowError(token, Constants.Error.TokenRequired)

      const decodedToken = jwt.verify(token, config.get('jwt.private_key'));

      let user;
      if (decodedToken.accountType === Constants.AccountType.Merchant) {
        user = await Merchant.findByPk(decodedToken.id);
        Checker.ifEmptyThrowError(user, Constants.Error.MerchantNotFound);
      } else if (decodedToken.accountType === Constants.AccountType.Staff) {
        user = await Staff.findByPk(decodedToken.id);
        Checker.ifEmptyThrowError(user, Constants.Error.StaffNotFound);
      } else {
        throw new CustomError(Constants.Error.UserUnauthorised);
      }

      return true;
    } catch (err) {
      return false;
    }
  },

  customerAndMerchantAndStaffOnly: async (token) => {
    try {
      Checker.ifEmptyThrowError(token, Constants.Error.TokenRequired)

      const decodedToken = jwt.verify(token, config.get('jwt.private_key'));

      let user;
      if (decodedToken.accountType === Constants.AccountType.Customer) {
        user = await Customer.findByPk(decodedToken.id);
        Checker.ifEmptyThrowError(user, Constants.Error.CustomerNotFound);
      } else if (decodedToken.accountType === Constants.AccountType.Merchant) {
        user = await Merchant.findByPk(decodedToken.id);
        Checker.ifEmptyThrowError(user, Constants.Error.MerchantNotFound);
      } else if (decodedToken.accountType === Constants.AccountType.Staff) {
        user = await Staff.findByPk(decodedToken.id);
        Checker.ifEmptyThrowError(user, Constants.Error.StaffNotFound);
      } else {
        throw new CustomError(Constants.Error.UserUnauthorised);
      }

      return true;
    } catch (err) {
      return false;
    }
  }
};