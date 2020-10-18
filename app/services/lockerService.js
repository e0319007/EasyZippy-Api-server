const Checker = require('../common/checker');
const Constants = require('../common/constants');
const Kiosk = require('../models/Kiosk');

const Locker = require('../models/Locker');
const LockerType = require('../models/LockerType');

module.exports = {
  createLocker: async(transaction) => {
    return await Locker.create({}, { transaction });
  },

  retrieveLocker: async(id) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    const locker = await Locker.findByPk(id);
    Checker.ifEmptyThrowError(locker, Constants.Error.LockerNotFound);
    Checker.ifDeletedThrowError(locker, Constants.Error.LockerDeleted);

    return locker;
  },

  retrieveAllLockers: async() => {
    return await Locker.findAll({where: { deleted: false } });
  },

  retrieveLockersByLockerType: async(lockerTypeId) => {
    Checker.ifEmptyThrowError(lockerTypeId, Constants.Error.IdRequired);
    const lockerType = await LockerType.findByPk(lockerTypeId);
    Checker.ifEmptyThrowError(lockerType, Constants.Error.LockerTypeNotFound);
    Checker.ifDeletedThrowError(lockerType, Constants.Error.LockerTypeDeleted);

    return await lockerType.getLockers();
  },

  retrieveLockersByKiosk: async(kioskId) => {
    Checker.ifEmptyThrowError(kioskId, Constants.Error.IdRequired);
    const kiosk = await Kiosk.findByPk(kioskId);
    Checker.ifEmptyThrowError(kiosk, Constants.Error.KioskNotFound);
    Checker.ifDeletedThrowError(kiosk, Constants.Error.KioskDeleted);

    return await kiosk.getLockers();
  },

  setLockerEmpty: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    const locker = await Locker.findByPk(id);
    Checker.ifEmptyThrowError(locker, Constants.Error.LockerNotFound);
    Checker.ifDeletedThrowError(locker, Constants.Error.LockerDeleted);

    return await locker.update({ lockerStatusEnum: Constants.LockerStatus.Empty }, { transaction });
  },

  setLockerInUse: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    const locker = await Locker.findByPk(id);
    Checker.ifEmptyThrowError(locker, Constants.Error.LockerNotFound);
    Checker.ifDeletedThrowError(locker, Constants.Error.LockerDeleted);

    return await locker.update({ lockerStatusEnum: Constants.LockerStatus.InUse }, { transaction });
  },

  toggleDisableLocker: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    const locker = await Locker.findByPk(id);
    Checker.ifEmptyThrowError(locker, Constants.Error.LockerNotFound);
    Checker.ifDeletedThrowError(locker, Constants.Error.LockerDeleted);

    return await locker.update({ disabled: !locker.disabled }, { transaction });
  },

  deleteLocker: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    const locker = await Locker.findByPk(id);
    Checker.ifEmptyThrowError(locker, Constants.Error.LockerNotFound);

    await locker.update({ deleted: true }, { transaction });
  }
};