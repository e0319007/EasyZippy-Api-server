const sequelize = require('../common/database');
const StaffService = require('../services/staffService');
const { sendErrorResponse } = require('../common/error/errorHandler');
const Staff = require('../models/Staff');

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
      const staffId = req.body.staffId;
      let staff = await StaffService.retrieveStaff(staffId);
      return res.status(200).send(staff);
    } catch (err){
      sendErrorResponse(res, err);
    }
  },

  retrieveAllStaff: async (req, res) => {
    try {
      let staffs = await StaffService.retrieveAllStaff();
      return res.status(200).send(staffs);
    } catch (err){
      sendErrorResponse(res, err);
    }
  },

  updateStaff: async (req, res) => {
    try {
      const staffData = req.body;
      let staff;
      await sequelize.transaction(async (transaction) => {
        staff = await StaffService.updateStaff(staffData, transaction);
      });
      return res.status(200).send(staff);
    } catch (err){
      sendErrorResponse(res, err);
    }
  },
  
  disableStaff: async (req, res) => {
    try {
      const staffId = req.body.staffId;
      await sequelize.transaction(async (transaction) => {
        staff = await StaffService.disableStaff(staffId, transaction)
      });
      return res.status(200).send(staff);
    } catch (err){
      sendErrorResponse(res, err);
    }
  },
};