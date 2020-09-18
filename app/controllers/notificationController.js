const { sendErrorResponse } = require('../common/error/errorHandler');
const sequelize = require('../common/database');

const NotificationService = require('../services/notificationService');

module.exports = {

  //for testing
  createNotification: async(req, res) => {
    try {
      const notificationData = req.body;
      let notification;
      await sequelize.transaction(async (transaction) => {
        notification = await NotificationService.createNotication(notificationData, transaction)
      });
      return res.status(200).send(notication);
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveAllNotificationByMerchantId: async(req, res) => {
    try {
      return res.status(200).send(notications);
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveAllNotificationByCustomerId: async(req, res) => {
    try {
      return res.status(200).send(notications);
    } catch(err) {
      sendErrorResponse(res, err);
    }
  }
}