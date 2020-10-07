const sequelize = require('../common/database');
const { sendErrorResponse } = require('../common/error/errorHandler');

const LockerService = require('../services/lockerService');

module.exports = {
  createLocker: async(req, res) => {
    try {
      let locker;
      await sequelize.transaction(async (transaction) => {
        locker = await LockerService.createLocker(transaction);
      });
      return res.status(200).send(locker);
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveLocker: async(req, res) => {
    try {
      const { id } = req.params;
      return res.status(200).send(await LockerService.retrieveLocker(id));
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveAllLockers: async(req, res) => {
    try {
      return res.status(200).send(await LockerService.retrieveAllLockers());
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveLockersByLockerType: async(req, res) => {
    try {
      const { lockerTypeId } = req.params;
      return res.status(200).send(await LockerService.retrieveLockersByLockerType(lockerTypeId));
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveLockersByKiosk: async(req, res) => {
    try {
      const { kioskId } = req.params;
      return res.status(200).send(await LockerService.retrieveLockersByKiosk(kioskId));
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  setLockerEmpty: async(req, res) => {
    try {
      const { id } = req.params;
      let locker;
      await sequelize.transaction(async (transaction) => {
        locker = await LockerService.setLockerEmpty(id, transaction);
      });
      return res.status(200).send(locker);
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  setLockerInUse: async(req, res) => {
    try {
      const { id } = req.params;
      let locker;
      await sequelize.transaction(async (transaction) => {
        locker = await LockerService.setLockerEmpty(id, transaction);
      });
      return res.status(200).send(locker);
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  toggleDisableLocker: async(req, res) => {
    try {
      const { id } = req.params;
      let locker;
      await sequelize.transaction(async (transaction) => {
        locker = await LockerService.toggleDisableLocker(id, transaction);
      });
      return res.status(200).send(locker);
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  deleteLocker: async(req, res) => {
    try {
      const { id } = req.params;
      await sequelize.transaction(async (transaction) => {
        await LockerService.deleteLocker(id, transaction);
      });
      return res.status(200).send();
    } catch(err) {
      sendErrorResponse(res, err);
    }
  }
};