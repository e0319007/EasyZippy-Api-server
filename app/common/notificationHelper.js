const Merchant = require("../models/Merchant");
const Order = require("../models/Order");
const Booking = require("../models/Booking");
const Customer = require("../models/Customer");

const NotificationService = require('../services/notificationService');
const Checker = require('../common/checker');
const Constants = require('../common/constants')
module.exports = {
  /**
   * SEND NOTI ABOUT MERCHANT APPLICATION
   */
  //send notification when staff receives a new merchant application
  notificationNewApplication: async(id, transaction) => {
    console.log('In notificationNewApplication')
    let merchant = await Merchant.findByPk(id);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);
    
    let title = 'New Merchant Application';
    let description = 'Click to view application by ' + merchant.name + '.';
    
    let senderModel = Constants.ModelEnum.Merchant;
    let receiverModel = Constants.ModelEnum.Staff;
    let senderId = id
    let receiverId = null;
    let forStaff = true;
    NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId, forStaff }, transaction);
  },

  //send notification to merchant after staff approves the merchant application
  notificationAccountApproval: async(id, transaction) => {
    let merchant = await Merchant.findByPk(id);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound); 

    let title = 'Account Approved';
    let description = 'Your account is approved, you can start posting products!';
    
    let senderModel = Constants.ModelEnum.Staff;
    let receiverModel = Constants.ModelEnum.Merchant;
    let senderId = null
    let receiverId = id;
    NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId }, transaction);
  },

  //send notification to merchant after staff approves the merchant application
  notificationAccountDisapproval: async(id, transaction) => {
    let merchant = await Merchant.findByPk(id);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound); 

    let title = 'Account Disapproved';
    let description = 'Your account is disapproved, please contact admin!';
    
    let senderModel = Constants.ModelEnum.Staff;
    let receiverModel = Constants.ModelEnum.Merchant;
    let senderId = null
    let receiverId = id;
    NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId }, transaction);
  },

  /**
   * SEND NOTI TO CUSTOMER ABOUT BOOKING
   */
  //send notification to customers that booking time starting in 10 minutes
   notificationBookingStartingSoon: async(bookingId, customerId, transaction) => {
    let customer = await Customer.findByPk(customerId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound); 

    let booking = await Booking.findByPk(bookingId);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound); 

    let title = 'Booking Starting';
    let description = 'Your booking with ID: ' + bookingId + ' is starting in 10 minutes';
    
    let senderModel = Constants.ModelEnum.Booking;
    let receiverModel = Constants.ModelEnum.Customer;
    let senderId = bookingId;
    let receiverId = customerId;
    NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId }, transaction);
  },
  //send notification to customers that booking time started
   notificationBookingStarted: async(bookingId, customerId, transaction) => {
    let customer = await Customer.findByPk(customerId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound); 

    let booking = await Booking.findByPk(bookingId);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound); 

    let title = 'Booking Started';
    let description = 'Your booking with ID: ' + bookingId + ' has started';
    
    let senderModel = Constants.ModelEnum.Booking;
    let receiverModel = Constants.ModelEnum.Customer;
    let senderId = bookingId;
    let receiverId = customerId;
    NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId }, transaction);
  },
  //send notification to customers that booking time reaching in 10 minutes
   notificationBookingReachingSoon: async(bookingId, customerId, transaction) => {
    let customer = await Customer.findByPk(customerId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound); 

    let booking = await Booking.findByPk(bookingId);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound); 

    let title = 'Booking Ending';
    let description = 'Your booking with ID: ' + bookingId + ' is ending in 10 minutes. Additional charges will apply if booking not retrieved in 10 minutes';
    
    let senderModel = Constants.ModelEnum.Booking;
    let receiverModel = Constants.ModelEnum.Customer;
    let senderId = bookingId;
    let receiverId = customerId;
    NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId }, transaction);
  },
  //send notification to customer that booking time reached
   notificationBookingReached: async(bookingId, customerId, transaction) => {
    let customer = await Customer.findByPk(customerId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound); 

    let booking = await Booking.findByPk(bookingId);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound); 

    let title = 'Booking Ended';
    let description = 'Your booking with ID: ' + bookingId + ' has ended. Additional charges will apply';
    
    let senderModel = Constants.ModelEnum.Booking;
    let receiverModel = Constants.ModelEnum.Customer;
    let senderId = bookingId;
    let receiverId = customerId;
    NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId }, transaction);
  },


  /**
   * SEND NOTI TO MERCHANT ABOUT BOOKING
   */
  //send notification to customers that booking time starting in 10 minutes
  notificationBookingStartingSoonMerchant: async(bookingId, merchantId, transaction) => {
    let merchant = await Customer.findByPk(merchantId);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound); 

    let booking = await Booking.findByPk(bookingId);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound); 

    let title = 'Booking Starting';
    let description = 'Your booking with ID: ' + bookingId + ' is starting in 10 minutes';
    
    let senderModel = Constants.ModelEnum.Booking;
    let receiverModel = Constants.ModelEnum.Merchant;
    let senderId = bookingId;
    let receiverId = merchantId;
    NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId }, transaction);
  },
  //send notification to customers that booking time started
   notificationBookingStartedMerchant: async(bookingId, merchantId, transaction) => {
    let merchant = await Customer.findByPk(merchantId);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound); 

    let booking = await Booking.findByPk(bookingId);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound); 

    let title = 'Booking Starting';
    let description = 'Your booking with ID: ' + bookingId + ' has started';
    
    let senderModel = Constants.ModelEnum.Booking;
    let receiverModel = Constants.ModelEnum.Merchant;
    let senderId = bookingId;
    let receiverId = merchantId;
    NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId }, transaction);
  },
  //send notification to customers that booking time reaching in 10 minutes
   notificationBookingReachingSoonMerchant: async(bookingId, merchantId, transaction) => {
    let merchant = await Customer.findByPk(merchantId);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound); 

    let booking = await Booking.findByPk(bookingId);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound); 

    let title = 'Booking Ending';
    let description = 'Your booking with ID: ' + bookingId + ' is ending in 10 minutes. Additional charges will apply if booking not retrieved in 10 minutes';
    
    let senderModel = Constants.ModelEnum.Booking;
    let receiverModel = Constants.ModelEnum.Merchant;
    let senderId = bookingId;
    let receiverId = merchantId;
    NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId }, transaction);
  },
  //send notification to customer that booking time reached
   notificationBookingReachedMerchant: async(bookingId, merchantId, transaction) => {
    let merchant = await Customer.findByPk(merchantId);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound); 

    let booking = await Booking.findByPk(bookingId);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound); 

    let title = 'Booking Ended';
    let description = 'Your booking with ID: ' + bookingId + ' has ended. Additional charges will apply';
    
    let senderModel = Constants.ModelEnum.Booking;
    let receiverModel = Constants.ModelEnum.Merchant;
    let senderId = bookingId;
    let receiverId = merchantId;
    NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId }, transaction);
  },


  /**
   * SEND NOTI ABOUT ORDER
   */

  //send notification to merchant of new order
  notificationNewOrder : async(orderId, merchantId, transaction) => {
    let order = await Order.findByPk(id);
    Checker.ifEmptyThrowError(order, Constants.Error.OrderNotFound); 

    let merchant = await Customer.findByPk(merchantId);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);

    let title = 'New Order';
    let description = 'You have a new order';
    
    let senderModel = Constants.ModelEnum.Order;
    let receiverModel = Constants.ModelEnum.Merchant;
    let senderId = orderId;
    let receiverId = merchantId;
    NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId }, transaction);
  },
  //send notifications to merchants that customer has received the order
   notificationOrderReceivedMerchant: async(orderId, merchantId, transaction) => {
    let order = await Order.findByPk(id);
    Checker.ifEmptyThrowError(order, Constants.Error.OrderNotFound); 

    let merchant = await Customer.findByPk(merchantId);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);

    let title = 'Order items received by customer';
    let description = 'Order items with order ID: ' + orderId + ' is collected by customer';
    
    let senderModel = Constants.ModelEnum.Order;
    let receiverModel = Constants.ModelEnum.Merchant;
    let senderId = orderId;
    let receiverId = merchantId;
    NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId }, transaction);
  },
  //send notifications to customer that the order is ready
  
  //send notification to customer that the order is in the kiosk
}