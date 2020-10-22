const sequelize = require('../common/database');
const { sendErrorResponse } = require('../common/error/errorHandler');
const lockerActionRecordService = require('../services/lockerActionRecordService');

module.exports = {
  retrieveAllLockerActions: async (req, res) => {
    try{
      return res.status(200).send(await lockerActionRecordService.retrieveAllLockerActions());
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveLockerActionsByLockerId: async (req, res) => {
    try{
      let {lockerId} = req.params;
      return res.status(200).send(await lockerActionRecordService.retrieveLockerActionsByLockerId(lockerId));
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },
}