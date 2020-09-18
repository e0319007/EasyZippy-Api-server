const emailValidator = require('email-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const fs = require('fs-extra');

const Helper = require('../common/helper');
const EmailHelper = require('../common/emailHelper');
const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');

const Merchant = require('../models/Merchant');
const { ifEmptyThrowError, isEmpty } = require('../common/checker');

const retrieveMerchantByEmail = async(email) => {
  const merchant = await Merchant.findOne({ where : { email } });
  if (Checker.isEmpty(merchant)) {
    throw new CustomError(Constants.Error.MerchantNotFound);
  } else {
    return merchant;
  }
};

const changePasswordForResetPassword = async(id, newPassword, transaction) => {
  Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
  Checker.ifEmptyThrowError(newPassword, Constants.Error.NewPasswordRequired);

  let merchant = await Merchant.findByPk(id);

  Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);

  if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/).test(newPassword)) {
    throw new CustomError(Constants.Error.PasswordWeak);
  }

  newPassword = await Helper.hashPassword(newPassword);

  merchant = await merchant.update({
    password: newPassword
  }, {
    where: { id },
    returning: true,
    transaction
  });
  return merchant;
};

module.exports = {
  createMerchant: async (merchantData, transaction) => {
    const { name, mobileNumber, password, email } = merchantData;

    Checker.ifEmptyThrowError(name, Constants.Error.NameRequired);
    Checker.ifEmptyThrowError(mobileNumber, Constants.Error.MobileNumberRequired);
    Checker.ifEmptyThrowError(password, Constants.Error.PasswordRequired);
    Checker.ifEmptyThrowError(email, Constants.Error.EmailRequired);

    merchantData.email = merchantData.email.toLowerCase();

    if (!emailValidator.validate(email)) {
      throw new CustomError(Constants.Error.InvalidEmail);
    }

    if (!Checker.isEmpty( await Merchant.findOne({ where: { mobileNumber } }))) {
      throw new CustomError(Constants.Error.MobileNumberNotUnique);
    }
    if (!Checker.isEmpty( await Merchant.findOne({ where: { email } }))) {
      throw new CustomError(Constants.Error.EmailNotUnique);
    }
    if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/).test(password)) {
      throw new CustomError(Constants.Error.PasswordWeak);
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

  retrieveMerchantByEmail: async(email) => {
    const merchant = await Merchant.findOne({ where: { email } });
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

    if(updateKeys.includes('password')) {
      throw new CustomError(Constants.Error.PasswordCannotChange);
    }
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

  toggleDisableMerchant: async(id, transaction) => {
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
  },

  loginMerchant: async(email, password) => {
    Checker.ifEmptyThrowError(email, Constants.Error.EmailRequired);
    Checker.ifEmptyThrowError(password, Constants.Error.PasswordRequired);

    email = email.toLowerCase();

    const merchant = await Merchant.findOne({ where: { email } });

    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);

    if (merchant.disabled) {
      throw new CustomError(Constants.Error.MerchantDisabled)
    }

    if (!(await Helper.comparePassword(password, merchant.password))) {
      throw new CustomError(Constants.Error.PasswordIncorrect);
    };

    if (!merchant.approved) {
      throw new CustomError(Constants.Error.MerchantNotApproved);
    }

    const token = jwt.sign(
      {
        id: merchant.id,
        accountType: Constants.AccountType.Merchant
      },
      config.get('jwt.private_key'),
      { expiresIn: '1d' }
    );

    return { merchant, token };
  },

  changePassword: async(id, newPassword, currentPassword, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(newPassword, Constants.Error.NewPasswordRequired);
    Checker.ifEmptyThrowError(currentPassword, Constants.Error.CurrentPasswordRequired);

    let merchant = await Merchant.findByPk(id);

    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);

    if (!(await Helper.comparePassword(currentPassword, merchant.password))) {
      throw new CustomError(Constants.Error.PasswordIncorrect);
    }

    if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/).test(newPassword)) {
      throw new CustomError(Constants.Error.PasswordWeak);
    }

    newPassword = await Helper.hashPassword(newPassword);

    merchant = await merchant.update({
      password: newPassword
    }, {
      where: { id },
      returning: true,
      transaction
    });
    return merchant;
  },

  preUploadCheck: async (id, file) => {
    ifEmptyThrowError(id, Constants.Error.IdRequired);
    ifEmptyThrowError(file, Constants.Error.FileRequired);
    if (isEmpty(file.mimetype) || !file.mimetype.startsWith('application/pdf')) {
      fs.remove(`./app/assets/${file.filename}`);
      throw new CustomError(Constants.Error.PdfFileRequired);
    }
  },

  uploadTenancyAgreement: async(id, tenancyAgreement, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(tenancyAgreement, Constants.Error.TenancyAgreementRequired);

    let merchant = await Merchant.findByPk(id);

    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);

    merchant = await merchant.update({ tenancyAgreement }, { returning: true, transaction });

    return merchant;
  },

  sendResetPasswordEmail: async(email) => {
    let merchant;
    try{
    merchant = await retrieveMerchantByEmail(email);
    } catch (err) {
      throw new CustomError(Constants.Error.MerchantNotFound);
    }
    let token = await EmailHelper.generateToken();
    let resetPasswordExpires = Date.now() + 3600000; //1h

    merchant = await merchant.update({
      resetPasswordToken: token,
      resetPasswordExpires
    }, {
      where: {
        email
      }
    });
    
    await EmailHelper.sendEmail(email, token);
  },

  checkValidToken: async(token, email) => {
    Checker.ifEmptyThrowError(email, Constants.Error.EmailRequired);
    let merchant = await Merchant.findOne({
      where: {
        resetPasswordToken: token,
        email
      }
    });
    Checker.ifEmptyThrowError(merchant, Constants.Error.TokenNotFound);
  },

  resetPassword: async(email, token, password, transaction) => {
    let merchant = await Merchant.findOne({
      where: {
        email,
        resetPasswordToken: token
      }
    });
    Checker.ifEmptyThrowError(merchant, Constants.Error.TokenNotFound)
    let id = merchant.id;
    if(merchant.resetPasswordExpires < Date.now()) {
      throw new CustomError(Constants.Error.TokenExpired)
    } else {
      merchant = await changePasswordForResetPassword(id, password, transaction);
    }
    return merchant;
  },
};