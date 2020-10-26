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
const Location = require('../models/Location');


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
    const { name, mobileNumber, password, email, blk, street, postalCode, unitNumber, floor, pointOfContact, locationId } = merchantData;

    Checker.ifEmptyThrowError(name, Constants.Error.NameRequired);
    Checker.ifEmptyThrowError(mobileNumber, Constants.Error.MobileNumberRequired);
    Checker.ifEmptyThrowError(password, Constants.Error.PasswordRequired);
    Checker.ifEmptyThrowError(email, Constants.Error.EmailRequired);
    Checker.ifEmptyThrowError(blk, 'Blk ' + Constants.Error.XXXIsRequired);
    Checker.ifNotNumberThrowError(blk, 'Blk ' + Constants.Error.XXXMustBeNumber)
    Checker.ifEmptyThrowError(street, 'Street ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(postalCode, 'Postal code ' + Constants.Error.XXXIsRequired);
    Checker.ifNotNumberThrowError(postalCode, 'Postal code ' + Constants.Error.XXXMustBeNumber)
    Checker.ifEmptyThrowError(unitNumber, 'Unit number ' + Constants.Error.XXXIsRequired);
    Checker.ifNotNumberThrowError(unitNumber, 'Unit number ' + Constants.Error.XXXMustBeNumber)
    Checker.ifEmptyThrowError(pointOfContact, 'Point of contact ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(floor, 'Floor ' + Constants.Error.XXXIsRequired);
    Checker.ifNotNumberThrowError(floor, 'Floor ' + Constants.Error.XXXMustBeNumber)
    Checker.ifEmptyThrowError(locationId, 'Location Id ' + Constants.Error.XXXIsRequired);

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

    let location = Location.findByPk(locationId);
    let locations = new Array();
    locations.push(location);

    merchantData.password = await Helper.hashPassword(password);

    const merchant = await Merchant.create({ name, mobileNumber, password, email, blk, street, postalCode, unitNumber, floor, pointOfContact, locations }, { transaction });

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
      const merchantWithMobileNumber = await Merchant.findOne({ where: { mobileNumber: merchantData.mobileNumber } });
      if(!Checker.isEmpty(merchantWithMobileNumber) && merchantWithMobileNumber.id !== parseInt(id)) {
        throw new CustomError(Constants.Error.MobileNumberNotUnique);
      }
    }
    if(updateKeys.includes('blk')) {
      Checker.ifEmptyThrowError(merchantData.blk, 'Blk number ' + Constants.Error.XXXIsRequired);
      Checker.ifNotNumberThrowError(merchantData.blk, 'Blk ' + Constants.Error.XXXMustBeNumber)
    }
    if(updateKeys.includes('street')) {
      Checker.ifEmptyThrowError(merchantData.street, 'Street ' + Constants.Error.XXXIsRequired);    
    }
    if(updateKeys.includes('postalCode')) {
      Checker.ifNotNumberThrowError(merchantData.postalCode, 'Postal Code ' + Constants.Error.XXXMustBeNumber)
      Checker.ifEmptyThrowError(merchantData.postalCode, 'Postal code ' + Constants.Error.XXXIsRequired);    
    }
    if(updateKeys.includes('unitNumber')) {
      Checker.ifNotNumberThrowError(merchantData.unitNumber, 'Unit number ' + Constants.Error.XXXMustBeNumber)
      Checker.ifEmptyThrowError(merchantData.unitNumber, 'Unit number ' + Constants.Error.XXXIsRequired);
    }
    if(updateKeys.includes('pointOfContact')) {
      Checker.ifEmptyThrowError(merchantData.pointOfContact, 'Point of contact ' + Constants.Error.XXXIsRequired);
    }
    if(updateKeys.includes('floor')) {
      Checker.ifEmptyThrowError(merchantData.floor, 'Floor ' + Constants.Error.XXXIsRequired);
    }

    if(updateKeys.includes('email')) {
      Checker.ifEmptyThrowError(merchantData.email, Constants.Error.EmailRequired);
      const merchantWithEmail = await Merchant.findOne({ where: { email: merchantData.email } });
      if (!Checker.isEmpty(merchantWithEmail) && merchantWithEmail.id !== parseInt(id)) {
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
    let merchant = await Merchant.update({
      disabled: !curMerchant.disabled
    }, {
      where: {
        id
      }, returning: true, transaction });
    return merchant;
  },

  approveMerchant: async(id, transaction) => {
    const curMerchant = await Merchant.findByPk(id);
    Checker.ifEmptyThrowError(curMerchant, Constants.Error.MerchantNotFound);
    let merchant = await Merchant.update( {
      approved: !curMerchant.approved
    }, {
      where: { 
        id
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