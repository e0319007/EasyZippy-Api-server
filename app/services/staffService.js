const emailValidator = require('email-validator');

const Helper = require('../common/helper');
const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');

const Staff = require('../models/Staff');

module.exports = {
  createStaff: async (staffData, transaction) => {
    const { firstname, lastname, mobileNumber, password, email } = staffData;

    Checker.ifEmptyThrowError(firstname, Constants.Error.NameRequired);
    Checker.ifEmptyThrowError(lastname, Constants.Error.NameRequired);
    Checker.ifEmptyThrowError(mobileNumber, Constants.Error.MobileNumberRequired);
    Checker.ifEmptyThrowError(password, Constants.Error.PasswordRequired);
    Checker.ifEmptyThrowError(email, Constants.Error.EmailRequired);

    if (!emailValidator.validate(email)) {
      throw new CustomError(Constants.Error.InvalidEmail);
    }
    if (!Checker.isEmpty( await Staff.findOne({ where: { mobileNumber } }))) {
      throw new CustomError(Constants.Error.MobileNumberNotUnique);
    }
    if (!Checker.isEmpty( await Staff.findOne({ where: { email } }))) {
      throw new CustomError(Constants.Error.EmailNotUnique);
    }

    staffData.password = await Helper.hashPassword(password);

    const staff = await Staff.create(staffData, { transaction });

    return staff;
  },

  retrieveStaff: async (staffId) => {
    const staff = Staff.findOne({
      where : {
        id : staffId
      }
    });
    if (Checker.isEmpty(staff)) {
      throw new CustomError(Constants.Error.StaffNotFound);
    } else {
      return staff;
    }
  },

  retrieveStaff: async () => {
    const staffs = Staff.findAll();
    return staffs;
  },

  updateStaff: async(staffData, transaction) => {
    const { id, firstname, lastname, mobileNumber, password, email } = staffData;

    Checker.ifEmptyThrowError(firstname, Constants.Error.NameRequired);
    Checker.ifEmptyThrowError(lastname, Constants.Error.NameRequired);
    Checker.ifEmptyThrowError(mobileNumber, Constants.Error.MobileNumberRequired);
    Checker.ifEmptyThrowError(password, Constants.Error.PasswordRequired);
    Checker.ifEmptyThrowError(email, Constants.Error.EmailRequired);

    if (!emailValidator.validate(email)) {
      throw new CustomError(Constants.Error.InvalidEmail);
    }
    if (Checker.isEmpty( await Staff.findOne({ where: { id } }))) {
      throw new CustomError(Constants.Error.StaffNotFound);
    }
    if (!Checker.isEmpty( await Staff.findOne({ where: { mobileNumber } }))) {
      throw new CustomError(Constants.Error.MobileNumberNotUnique);
    }
    if (!Checker.isEmpty( await Staff.findOne({ where: { email } }))) {
      throw new CustomError(Constants.Error.EmailNotUnique);
    }

    let staff = Staff.update({
      firstname: firstname,
      lastname: lastname,
      mobileNumber: mobileNumber,
      email: email
    }, {
      where : {
        id : staffId
      }
    }, { transaction });
     return staff;
  },

  disableStaff: async(staffId, transaction) => {
    const curStaff = Staff.findOne({
      where : {
        id : staffId
      }
    });
    if (Checker.isEmpty(staff)) {
      throw new CustomError(Constants.Error.StaffNotFound);
    }
    let staff = Staff.update({
      disabled: !curStaff.disabled
    }, {
      where : {
        id : staffId
      }
    }, { transaction });
     return staff;
  }
};