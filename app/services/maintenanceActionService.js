
const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');
const Locker = require('../models/Locker');

const MaintenanceAction = require('../models/MaintenanceAction')

module.exports = {
  createMaintenanceAction: async(maintenanceActionData, transaction) => {
    const { maintenanceDate, description, lockerCode, kioskId } = maintenanceActionData;
    Checker.ifEmptyThrowError(maintenanceDate, Constants.Error.DateRequired);
    Checker.ifEmptyThrowError(lockerCode, 'Locker code' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(kioskId, 'Kiosk Id' + Constants.Error.XXXIsRequired);
    let locker = await Locker.findOne( {where: {
      lockerCode,
      kioskId
    } });
    Checker.ifEmptyThrowError(locker, Constants.Error.LockerNotFound);
    let lockerId = locker.id;

    const maintenanceAction = await MaintenanceAction.create({ maintenanceDate, description, lockerId, kioskId}, { transaction });
    return maintenanceAction;
  },
 
  updateMaintenanceAction: async(id, maintenanceActionData, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let maintenanceAction = await MaintenanceAction.findByPk(id);
    Checker.ifEmptyThrowError(maintenanceAction, Constants.Error.MaintenanceActionNotFound);
    Checker.ifEmptyThrowError(maintenanceAction, Constants.Error.MaintenanceActionDeleted);

    const updateKeys = Object.keys(maintenanceActionData);
    if(updateKeys.includes('maintenanceDate')) {
      Checker.ifEmptyThrowError(maintenanceActionData.maintenanceDate, Constants.Error.DateRequired);
    }
    if(updateKeys.includes('lockerId')) {
      Checker.ifEmptyThrowError(await Locker.findByPk(maintenanceActionData.lockerId), Constants.Error.LockerNotFound);
    }

    maintenanceAction = await maintenanceAction.update(maintenanceActionData, { returning: true, transaction});
    return maintenanceAction;
  },

  retrieveMaintenanceAction: async(id) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    const maintenanceAction = await MaintenanceAction.findByPk(id);
    Checker.ifEmptyThrowError(maintenanceAction, Constants.Error.MaintenanceActionNotFound);
    Checker.ifEmptyThrowError(maintenanceAction, Constants.Error.MaintenanceActionDeleted);

    return maintenanceAction;
  },

  retrieveAllMaintenanceAction: async() => {
    const maintenanceActions = await MaintenanceAction.findAll({where: { deleted: false } });
    return maintenanceActions;
  },
    
  deleteMaintenanceAction: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    const maintenanceAction = await MaintenanceAction.findByPk(id);
    Checker.ifEmptyThrowError(maintenanceAction, Constants.Error.MaintenanceActionNotFound);
    await MaintenanceAction.update({ deleted: true }, { where: { id }, transaction });
  },
}