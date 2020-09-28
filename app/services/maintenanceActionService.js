
const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');
const Locker = require('../models/Locker');

const MaintenanceAction = require('../models/MaintenanceAction')

module.exports = {
  createMaintenanceAction: async(maintenanceActionData, transaction) => {
    const { maintenanceDate, description, lockerId} = maintenanceActionData;
    Checker.ifEmptyThrowError(maintenanceDate, Constants.Error.DateRequired);
    Checker.ifEmptyThrowError(lockerId, 'Locker ' + Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(await Locker.findByPk(lockerId), Constants.Error.LockerNotFound);
    const maintenanceAction = MaintenanceAction.create(maintenanceActionData, { transaction });
    return maintenanceAction;
  },
 
  updateMaintenanceAction: async(id, maintenanceActionData, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let maintenanceAction = await MaintenanceAction.findByPk(id);
    Checker.ifEmptyThrowError(maintenanceAction, Constants.Error.MaintenanceActionNotFound);

    const updateKeys = Object.keys(maintenanceActionData);
    if(updateKeys.includes('maintenanceDate')) {
      Checker.ifEmptyThrowError(maintenanceActionData.maintenanceDate, Constants.Error.DateRequired);
    }

    maintenanceAction = await maintenanceAction.update(maintenanceActionData, { returning: true, transaction});
    return maintenanceAction;
  },

  retrieveMaintenanceAction: async(id) => {
    const maintenanceAction = await MaintenanceAction.findByPk(id);
    Checker.ifEmptyThrowError(maintenanceAction, Constants.Error.MaintenanceActionNotFound);
    return maintenanceAction;
  },

  retrieveAllMaintenanceAction: async() => {
    const maintenanceActions = await MaintenanceAction.findAll();
    return maintenanceActions;
  },
    
  deleteMaintenanceAction: async(id) => {
    const maintenanceAction = await MaintenanceAction.findByPk(id);
    Checker.ifEmptyThrowError(maintenanceAction, Constants.Error.MaintenanceActionNotFound);
    await MaintenanceAction.destroy({ where: { id } });
  },
}