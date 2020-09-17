const emailValidator = require('email-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');


const Helper = require('../common/helper');
const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');

const Staff = require('../models/Staff');

const retrieveStaffByEmail = async(email) => {
  const staff = await Staff.findOne({ where : { email } });
  if (Checker.isEmpty(staff)) {
    throw new CustomError(Constants.Error.StaffNotFound);
  } else {
    return staff;
  }
};

const changePasswordForResetPassword = async(id, newPassword, transaction) => {
  Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
  Checker.ifEmptyThrowError(newPassword, Constants.Error.NewPasswordRequired);

  let staff = await Staff.findByPk(id);

  Checker.ifEmptyThrowError(staff, Constants.Error.StaffNotFound);

  if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/).test(newPassword)) {
    throw new CustomError(Constants.Error.PasswordWeak);
  }

  newPassword = await Helper.hashPassword(newPassword);

  staff = await staff.update({
    password: newPassword
  }, {
    where: { id },
    returning: true,
    transaction
  });
  return staff;
};

module.exports = {
  createStaff: async (staffData, transaction) => {
    const { firstName, lastName, mobileNumber, password, email,  staffRoleEnum} = staffData;

    Checker.ifEmptyThrowError(firstName, Constants.Error.FirstNameRequired);
    Checker.ifEmptyThrowError(lastName, Constants.Error.LastNameRequired);
    Checker.ifEmptyThrowError(mobileNumber, Constants.Error.MobileNumberRequired);
    Checker.ifEmptyThrowError(password, Constants.Error.PasswordRequired);
    Checker.ifEmptyThrowError(email, Constants.Error.EmailRequired);
    Checker.ifEmptyThrowError(staffRoleEnum, 'StaffRoleEnum' + Constants.Error.EnumRequired);

    if(!emailValidator.validate(email)) {
      throw new CustomError(Constants.Error.EmailInvalid);
    }
    if(!Checker.isEmpty(await Staff.findOne({ where: { mobileNumber } }))) {
      throw new CustomError(Constants.Error.MobileNumberNotUnique);
    }
    if(!Checker.isEmpty(await Staff.findOne({ where: { email } }))) {
      throw new CustomError(Constants.Error.EmailNotUnique);
    }
    if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/).test(password)) {
      throw new CustomError(Constants.Error.PasswordWeak);
    }

    if(!_.includes(Constants.StaffRole, staffRoleEnum)) {
      throw new CustomError(staffRoleEnum + Constants.Error.EnumDoesNotExist);
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

    if(updateKeys.includes('password')) {
      throw new CustomError(Constants.Error.PasswordCannotChange);
    }
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

    return { staff, token };
  },

  changePassword: async(id, newPassword, currentPassword, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(newPassword, Constants.Error.NewPasswordRequired);
    Checker.ifEmptyThrowError(currentPassword, Constants.Error.CurrentPasswordRequired);

    let staff = await Staff.findByPk(id);

    Checker.ifEmptyThrowError(staff, Constants.Error.CustomerNotFound);

    if (!(await Helper.comparePassword(currentPassword, staff.password))) {
      throw new CustomError(Constants.Error.PasswordIncorrect);
    }

    if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/).test(newPassword)) {
      throw new CustomError(Constants.Error.PasswordWeak);
    }

    newPassword = await Helper.hashPassword(newPassword);

    staff = await staff.update({
      password: newPassword
    }, {
      where: { id },
      returning: true,
      transaction
    });
    return staff;
  },

  sendResetPasswordEmail: async(email) => {
    try{
    let staff = await retrieveStaffByEmail(email);
    } catch (err) {
      throw new CustomError(Constants.Error.StaffNotFound);
    }
    let token = await EmailHelper.generateToken();
    let resetPasswordExpires = Date.now() + 3600000; //1h

    staff = await staff.update({
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
    let staff = await Staff.findOne({
      where: {
        resetPasswordToken: token,
        email
      }
    });
    Checker.ifEmptyThrowError(staff, Constants.Error.TokenNotFound);
  },

  resetPassword: async(token, password, transaction) => {
    let staff = await Staff.findOne({
      where: {
        resetPasswordToken: token
      }
    });
    Checker.ifEmptyThrowError(staff, "Token cannot be found")
    let id = staff.id;
    if(staff.resetPasswordExpires < Date.now()) {
      throw new CustomError('Expired')
    } else {
      staff = await changePasswordForResetPassword(id, password, transaction);
    }
    return staff;
  },

  retrieveStaffByEmail
};