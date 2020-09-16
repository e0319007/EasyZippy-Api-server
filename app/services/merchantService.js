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
  },

  retrieveMerchant: async(id) => {
    const merchant = await Merchant.findByPk(id);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);
    return merchant;
  },

  retrieveAllMerchants: async() => {
    const merchants = await Merchant.findAll();
    return merchants;
  },

  updateMerchant: async(id, merchantData, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let merchant = await Merchant.findByPk(id);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);

    const updateKeys = Object.keys(merchantData);
    if(updateKeys.includes('firstName')) {
      Checker.ifEmptyThrowError(merchantData.firstName, Constants.Error.FirstNameRequired);
    }
    if(updateKeys.includes('lastName')) {
      Checker.ifEmptyThrowError(merchantData.lastName, Constants.Error.LastNameRequired);
    }
    if(updateKeys.includes('mobileNumber')) {
      Checker.ifEmptyThrowError(merchantData.mobileNumber, Constants.Error.MobileNumberRequired);
      if(!Checker.isEmpty(await Merchant.findOne({ where: { mobileNumber: merchantData.mobileNumber } }))) {
        throw new CustomError(Constants.Error.MobileNumberNotUnique);
      }
    }
    if(updateKeys.includes('email')) {
      Checker.ifEmptyThrowError(merchantData.email, Constants.Error.EmailRequired);
      if (!Checker.isEmpty(await Merchant.findOne({ where: { email } }))) {
        throw new CustomError(Constants.Error.EmailNotUnique);
      }
      if (!emailValidator.validate(merchantData.email)) {
        throw new CustomError(Constants.Error.InvalidEmail);
      }
    }

    merchant = await merchant.update(merchantData, { returning: true, transaction });
    return merchant;
  },

  disableMerchant: async(id, transaction) => {
    const curMerchant = await Merchant.findByPk(id);
    Checker.ifEmptyThrowError(curMerchant);
    let merchant = Merchant.update( {
      disabled: !curMerchant.disabled
    }, {
      where: { 
        id: id
      }, returning: true, transaction });
    return merchant;
  },

  approveMerchant: async(id, transaction) => {
    const curMerchant = await Merchant.findByPk(id);
    Checker.ifEmptyThrowError(curMerchant);
    let merchant = Merchant.update( {
      approved: !curMerchant.approved
    }, {
      where: { 
        id: id
      }
    , returning: true, transaction });
    return merchant;
  }
};