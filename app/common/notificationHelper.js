const Merchant = require("../models/Merchant");
const Order = require("../models/Order");
const Booking = require("../models/Booking");
const Customer = require("../models/Customer");

const NotificationService = require('../services/notificationService');

module.exports = {
  //send notification when staff receives a new merchant application
  notificationNewApplication: (id) => {
    let merchant = Merchant.findByPk(id);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);
    
    let title = 'New Merchant Application';
    let description = 'New merchant(' + merchant.name + ') waiting for approval.';
    
    let senderModel = Constants.ModelEnum.Merchant;
    let receiverModel = Constants.ModelEnum.Staff;
    let senderId = id
    let receiverId = null;
    let forStaff = true;
    NotificationService.createNotification({ title, description, modelRequired, senderModel, senderId, receiverModel, receiverId, forStaff });
  },

  //send notification to merchant after staff approves the merchant application
  notificationAccountApproval: (id) => {
    let merchant = Merchant.findByPk(id);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound); 

    let title = 'Account Approved';
    let description = 'Your account is approved, you can start posting products!';
    
    let senderModel = Constants.ModelEnum.Staff;
    let receiverModel = Constants.ModelEnum.Merchant;
    let senderId = null
    let receiverId = id;
    NotificationService.createNotification({ title, description, modelRequired, senderModel, senderId, receiverModel, receiverId });
  },

  //send notification to merchant of new order
  notificationNewOrder : (orderId, merchantId) => {
    let order = Order.findByPk(id);
    Checker.ifEmptyThrowError(order, Constants.Error.OrderNotFound); 

    let title = 'New Order';
    let description = 'You have a new order';
    
    let senderModel = Constants.ModelEnum.Order;
    let receiverModel = Constants.ModelEnum.Merchant;
    let senderId = orderId;
    let receiverId = merchantId;
    NotificationService.createNotification({ title, description, modelRequired, senderModel, senderId, receiverModel, receiverId });
  },

  //send notification to customers that booking time starting in 10 mins
   notificationBookingStartingSoon : (bookingId, customerId) => {

  },
  //send notification to customers that booking time started
   notificationBookingStarted : (bookingId, customerId) => {

  },
  //send notification to customers that booking time reaching in 10 mins
   notificationBookingReachingSoon : (bookingId, customerId) => {

  },
  //send notification to customer that booking time reached
   notificationBookingReached : (bookingId, customerId) => {

  },
  //send notifications to merchants that customer has received the order
   notificationOrderReceived : (orderId, merchantId) => {

  }
}