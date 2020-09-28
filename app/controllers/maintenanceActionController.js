const sequelize = require('../common/database');
const MerchantService = require('../services/merchantService');
const { sendErrorResponse } = require('../common/error/errorHandler');

const MaintenanceActionService = require('../services/maintenanceActionService')

module.exports = {
  createMaintenanceAction: async (req, res) => {
    try {
      const maintenanceActionData = req.body;
      let maintenanceAction;

      await sequelize.transaction(async (transaction) => {
        maintenanceAction = await MaintenanceActionService.createMaintenanceAction(maintenanceActionData, transaction);
      });

      return res.status(200).send(maintenanceAction);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  updateMaintenanceAction: async (req, res) => {
    try {
      const maintenanceActionData = req.body;
      const { id } = req.params;
      let maintenanceAction;
      await sequelize.transaction(async (transaction) => {
        maintenanceAction = await MaintenanceActionService.updateMaintenanceAction(id, maintenanceActionData, transaction);
      });
      return res.status(200).send(maintenanceAction);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveMaintenanceAction: async (req, res) => {
    try {
      const { id } = req.params;
      let maintenanceAction;
      await sequelize.transaction(async (transaction) => {
        maintenanceAction = await MaintenanceActionService.retrieveMaintenanceAction(id, transaction);
      })
      return res.status(200).send(maintenanceAction);
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  },

  retrieveAllMaintenanceAction: async (req, res) => {
    try {
      return res.status(200).send(await MaintenanceActionService.retrieveAllMaintenanceAction());
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  deleteMaintenanceAction: async (req, res) => {
    try {
      let { id } = req.params;
      await MaintenanceActionService.deleteMaintenanceAction(id);
      return res.status(200).send();
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },
}