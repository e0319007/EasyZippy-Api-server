const emailValidator = require('email-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

const Helper = require('../common/helper');
const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');

const Staff = require('../models/Staff');

module.exports = {
  createStaff: async (staffData, transaction) => {
    const { firstName, lastName, mobileNumber, password, email } = staffData;

    Checker.ifEmptyThrowError(firstName, Constants.Error.FirstNameRequired);
    Checker.ifEmptyThrowError(lastName, Constants.Error.LastNameRequired);
    Checker.ifEmptyThrowError(mobileNumber, Constants.Error.MobileNumberRequired);
    Checker.ifEmptyThrowError(password, Constants.Error.PasswordRequired);
    Checker.ifEmptyThrowError(email, Constants.Error.EmailRequired);

    if(!emailValidator.validate(email)) {
      throw new CustomError(Constants.Error.EmailInvalid);
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

  retrieveStaff: async (id) => {
    const staff = await Staff.findByPk(id);
    
    if (Checker.isEmpty(staff)) {
      throw new CustomError(Constants.Error.StaffNotFound);
    } else {
      return staff;
    }
  },

  // To include a method to retrieve all staff excluding disabled ones, likewise for other 2 users

  retrieveAllStaff: async () => {
    const staffs = await Staff.findAll();
    return staffs;
  },

  updateStaff: async(id, staffData, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let staff = await Staff.findByPk(id);
    Checker.ifEmptyThrowError(staff, Constants.Error.StaffNotFound);

    const updateKeys = Object.keys('staffData');

    if(updateKeys.includes('firstName')) {
      Checker.ifEmptyThrowError(staffData.firstName, Constants.Error.FirstNameRequired);
    }
    if(updateKeys.includes('lastName')) {
      Checker.ifEmptyThrowError(staffData.lastName, Constants.Error.LastNameRequired);
    }
    if(updateKeys.includes('mobileNumber')) {
      Checker.ifEmptyThrowError(staffData.mobileNumber, Constants.Error.MobileNumberRequired);
      if(!Checker.isEmpty(await Staff.findOne({ where: { mobileNumber: staffData.mobileNumber } }))) {
        throw new CustomError(Constants.Error.MobileNumberNotUnique);
      }
    }
    if(updateKeys.includes('email')) {
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

  toggleDisableStaff: async(id, transaction) => {
    const curStaff = await Staff.findOne({
      where : {
        id
      }
    });
    Checker.ifEmptyThrowError(curStaff, Constants.Error.StaffNotFound);
    
    let staff = Staff.update({
      disabled: !curStaff.disabled
    }, {
      where : {
        id
      }
    }, { transaction });
    return staff;
  },

  loginStaff: async(email, password) => {
    Checker.ifEmptyThrowError(email, Constants.Error.EmailRequired);
    Checker.ifEmptyThrowError(password, Constants.Error.PasswordRequired);

    const staff = await Staff.findOne({ where: { email } });

    Checker.ifEmptyThrowError(staff, Constants.Error.StaffNotFound);

    if (staff.disabled) {
      throw new CustomError(Constants.Error.StaffDisabled);
    }

    if (!(await Helper.comparePassword(password, staff.password))) {
      throw new CustomError(Constants.Error.PasswordIncorrect);
    };

    const token = jwt.sign(
      {
        id: staff.id,
        accountType: Constants.AccountType.Staff
      },
      config.get('jwt.private_key'),
      { expiresIn: '1d' }
    );

    return token;
  }
};