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
      console.log(err);
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
;    }
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

  loginStaff: async (req, res) => {
    try {
      const { email, password } = req.body;

      const { staff, token } = await StaffService.loginStaff(email, password);

      return res.status(200).send({ staff, token });
    } catch (err) {
      sendErrorResponse(res, err, 401);
    }
  },

  changePassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword, currentPassword } = req.body;
      let staff;
      await sequelize.transaction(async (transaction) => {
        staff = await StaffService.changePassword(id, newPassword, currentPassword, transaction)
      });
      return res.status(200).send(staff);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  sendResetPasswordEmail: async (req, res) => {
    try {
      const { email } = req.body;
      const host = req.headers.host;
      await StaffService.sendResetPasswordEmail(email, host);
      return res.status(200).send();
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  checkValidToken: async (req, res) => {
    try {
      const { token } = req.body;
      const { email } = req.body;
      await StaffService.checkValidToken(token, email);
      return res.status(200).send();
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token } = req.body;
      const { newPassword } = req.body;
      let staff;
      await sequelize.transaction(async (transaction) => {
        staff = await StaffService.resetPassword(token, newPassword, transaction);
      });
      return res.status(200).send(staff);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
};