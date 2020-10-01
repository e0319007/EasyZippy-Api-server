const sequelize = require('../common/database');
const { sendErrorResponse } = require('../common/error/errorHandler');


const LockerTypeService = require('../services/lockerTypeService');
module.exports = {
  createLockerType: async(req, res) => {
    try {
      const lockerTypeData = req.body;
      let lockerType;
      await sequelize.transaction(async (transaction) => {
        lockerType = await LockerTypeService.createLockerType(lockerTypeData, transaction);
      });
      return res.status(200).send(lockerType);
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  updateLockerType: async(req, res) => {
    try {
      const lockerTypeData = req.body;
      let lockerType;
      const { id } = req.params;
      await sequelize.transaction(async (transaction) => {
        lockerType = await LockerTypeService.updateLockerType(id, lockerTypeData, transaction);
      });
      return res.status(200).send(lockerType);
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveLockerType: async(req, res) => {
    try {
      const { id } = req.params;
      let lockerType = await LockerTypeService.retrieveLockerType(id);
      return res.status(200).send(lockerType);      
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveAllLockerTypes: async(req, res) => {
    try {
      let lockerTypes = await LockerTypeService.retrieveAllLockerType();
      return res.status(200).send(lockerTypes);
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  toggleDisableLockerType: async(req, res) => {
    try {
      const { id } = req.params;
      let lockerType;
      await sequelize.transaction(async (transaction) => {
        lockerType = await LockerTypeService.toggleDisableLockerType(id, transaction);
      })
      return res.status(200).send(lockerType);      
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  deleteLockerType: async(req, res) => {
    try {
      let { id } = req.params;
      await LockerTypeService.deleteLockerType(id);
      return res.status(200).send();
    } catch(err) {
      sendErrorResponse(res, err);
    }
  }
}
