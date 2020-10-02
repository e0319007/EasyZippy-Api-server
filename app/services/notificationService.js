const Checker = require("../common/checker");
const Constants = require('../common/constants');
const Merchant = require("../models/Merchant");

const Notification = require('../models/Notification');

module.exports = {
  createNotification: async(notificationData, transaction) => {
    Checker.ifEmptyThrowError(notificationData.title, Constants.Error.TitleRequired)
    const notification = await Notification.create(notificationData, { transaction })
    return notification;
  },

  retrieveAllNotificationByMerchantId: async(merchantId) => {
    Checker.ifEmptyThrowError(merchantId, Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(await Merchant.findByPk(merchantId), Constants.Error.MerchantNotFound);
    const notifications = await Notification.findAll({ where: { merchantId } });
    return notifications;
  },

  retrieveAllNotificationByCustomerId: async(customerId) => {
    Checker.ifEmptyThrowError(customerId, Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(await Merchant.findByPk(customerId), Constants.Error.CustomerNotFound);
    const notifications = await Notification.findAll({ where: { customerId } });
    return notifications;
  },

  retrieveStaffNotification: async() => {
    const notifications = await Notification.findAll({ where: { forStaff: true } });
    return notifications;
  },

  readNotification: async(id) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let notification = await Notification.findByPk(id);
    Checker.ifEmptyThrowError(notification, Constants.Error.NotificationNotFound)
    return await notification.update({ read: true });
  }
  
}