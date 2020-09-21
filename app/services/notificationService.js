const Checker = require("../common/checker");
const Constants = require('../common/constants');
const CustomError = require("../common/error/customError");

const Notification = require('../models/Notification');

module.exports = {
  createNotification: async(notificationData, transaction) => {
    const notification = await Notification.create(notificationData, { transaction })
    return notification;
  },

  retrieveAllNotificationByMerchantId: async(merchantId) => {
    const notifications = await Notification.findAll({ where: { merchantId } });
    return notifications;
  },

  retrieveAllNotificationByCustomerId: async(customerId) => {
    const notifications = await Notification.findAll({ where: { customerId } });
    return notifications;
  },

  readNotification: async(id) => {
    let notification = await Notification.findByPk(id);
    return await notification.update({ read: true });
  }
  
}