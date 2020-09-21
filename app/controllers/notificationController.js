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
        notification = await NotificationService.createNotification(notificationData, transaction)
      });
      return res.status(200).send(notication);
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveAllNotificationByMerchantId: async(req, res) => {
    try {
      const { merchantId } = req.body;
      let notifications = NotificationService.retrieveAllNotificationByMerchantId(merchantId);
      return res.status(200).send(notifications);
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveAllNotificationByCustomerId: async(req, res) => {
    try {
      const { customerId } = req.body;
      let notifications = NotificationService.retrieveAllNotificationByCustomerId(customerId);
      return res.status(200).send(notifications);
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },
  
  readNotification: async(req, res) => {
    try {
      const { id } = req.params;
      let notification = NotificationService.customerReadNotification(id);
      return res.status(200).send(notification);
    } catch(err) {
      sendErrorResponse(res, err);
    }
  }
}