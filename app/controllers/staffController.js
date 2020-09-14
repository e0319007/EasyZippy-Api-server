const sequelize = require('../common/database');
const StaffService = require('../services/staffService');
const { sendErrorResponse } = require('../common/error/errorHandler');

module.exports = {
  registerStaff: async (req, res) => {
    try {
      const staffData = req.body;
      let staff;

      await sequelize.transaction(async (transaction) => {
        staff = await StaffService.createStaff(staffData, transaction);
      });

      return res.status(200).send(staff);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveStaff: async (req, res) => {
    try {
      const { id } = req.params;
      let staff = await StaffService.retrieveStaff(id);
      return res.status(200).send(staff);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveAllStaff: async (req, res) => {
    try {
      let staffs = await StaffService.retrieveAllStaff();
      return res.status(200).send(staffs);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  updateStaff: async (req, res) => {
    try {
      const staffData = req.body;
      const { id } = req.params;
      let staff;
      await sequelize.transaction(async (transaction) => {
        staff = await StaffService.updateStaff(id, staffData, transaction);
      });
      return res.status(200).send(staff);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },
  
  toggleDisableStaff: async (req, res) => {
    try {
      const { id } = req.params;
      let staff;
      await sequelize.transaction(async (transaction) => {
        staff = await StaffService.toggleDisableStaff(id, transaction);
      });
      return res.status(200).send(staff);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },
};