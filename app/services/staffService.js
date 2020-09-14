const emailValidator = require('email-validator');

const Helper = require('../common/helper');
const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');

const Staff = require('../models/Staff');
const { ifEmptyThrowError } = require('../common/checker');

module.exports = {
  createStaff: async (staffData, transaction) => {
    const { firstname, lastname, mobileNumber, password, email } = staffData;

    Checker.ifEmptyThrowError(firstname, Constants.Error.NameRequired);
    Checker.ifEmptyThrowError(lastname, Constants.Error.NameRequired);
    Checker.ifEmptyThrowError(mobileNumber, Constants.Error.MobileNumberRequired);
    Checker.ifEmptyThrowError(password, Constants.Error.PasswordRequired);
    Checker.ifEmptyThrowError(email, Constants.Error.EmailRequired);

    if(!emailValidator.validate(email)) {
      throw new CustomError(Constants.Error.InvalidEmail);
    }
    if(!Checker.isEmpty(await Staff.findOne({ where: { mobileNumber } }))) {
      throw new CustomError(Constants.Error.MobileNumberNotUnique);
    }
    if(!Checker.isEmpty(await Staff.findOne({ where: { email } }))) {
      throw new CustomError(Constants.Error.EmailNotUnique);
    }

    staffData.password = await Helper.hashPassword(password);

    const staff = await Staff.create(staffData, { transaction });

    return staff;
  },

  retrieveStaff: async (staffId) => {
    const staff = await Staff.findByPk(staffId);
    
    if (Checker.isEmpty(staff)) {
      throw new CustomError(Constants.Error.StaffNotFound);
    } else {
      return staff;
    }
  },

  retrieveAllStaff: async () => {
    const staffs = await Staff.findAll();
    return staffs;
  },

  updateStaff: async(id, staffData, transaction) => {
    Checker.ifEmptyThrowError(staffId, Constants.Error.IdRequired);
    let staff = await Staff.findByPk(id);
    Checker.ifEmptyThrowError(staff, Constants.Error.StaffNotFound);

    const updateKeys = Object.keys(staffData);

    if(updateKeys.includes(firstName)) {
      Checker.ifEmptyThrowError(staffData.firstName, Constants.Error.FirstNameRequired);
    }
    if(updateKeys.includes(lastName)) {
      Checker.ifEmptyThrowError(staffData.lastName, Constants.Error.LastNameRequired);
    }
    if(updateKeys.includes(mobileNumber)) {
      Checker.ifEmptyThrowError(staffData.mobileNumber, Constants.Error.MobileNumberRequired);
      if(!Checker.isEmpty(await Staff.findOne({ where: { mobileNumber } }))) {
        throw new CustomError(Constants.Error.MobileNumberNotUnique);
      }
    }
    if(updateKeys.includes(email)) {
      Checker.ifEmptyThrowError(staffData.email, Constants.Error.EmailRequired);
      if (!Checker.isEmpty(await Staff.findOne({ where: { email } }))) {
        throw new CustomError(Constants.Error.EmailNotUnique);
      }
      if (!emailValidator.validate(staffData.email)) {
        throw new CustomError(Constants.Error.InvalidEmail);
      }
    }
    staff = await staff.update(staffData, { returning: true, transaction });
    return staff;
  },

  disableStaff: async(staffId, transaction) => {
    const curStaff = await Staff.findOne({
      where : {
        id : staffId
      }
    });
    Checker.ifEmptyThrowError(staff, Constants.Error.StaffNotFound);
    
    let staff = Staff.update({
      disabled: !curStaff.disabled
    }, {
      where : {
        id : staffId
      }
    }, { returning: true, transaction });
    return staff;
  }
};