const emailValidator = require('email-validator');

const Helper = require('../common/helper');
const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');

const Merchant = require('../models/Merchant');

module.exports = {
  createMerchant: async (merchantData, transaction) => {
    const { name, mobileNumber, password, email } = merchantData;

    Checker.ifEmptyThrowError(name, Constants.Error.NameRequired);
    Checker.ifEmptyThrowError(mobileNumber, Constants.Error.MobileNumberRequired);
    Checker.ifEmptyThrowError(password, Constants.Error.PasswordRequired);
    Checker.ifEmptyThrowError(email, Constants.Error.EmailRequired);

    if (!emailValidator.validate(email)) {
      throw new CustomError(Constants.Error.InvalidEmail);
    }

    if (!Checker.isEmpty( await Merchant.findOne({ where: { mobileNumber } }))) {
      throw new CustomError(Constants.Error.MobileNumberNotUnique);
    }
    if (!Checker.isEmpty( await Merchant.findOne({ where: { email } }))) {
      throw new CustomError(Constants.Error.EmailNotUnique);
    }

    merchantData.password = await Helper.hashPassword(password);

    const merchant = await Merchant.create(merchantData, { transaction });

    return merchant;
  }
};