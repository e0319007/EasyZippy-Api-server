const Checker = require('../common/checker');
const { LockerAction } = require('../common/constants');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');
const LockerActionRecord = require('../models/LockerActionRecord');

module.exports = {
  retrieveAllLockerActions: async() => {
    return await LockerActionRecord.findAll();
  },

  retrieveLockerActionsByLockerId: async(lockerId) => {
    return await LockerActionRecord.findAll({ where: { lockerId } });
  }
}