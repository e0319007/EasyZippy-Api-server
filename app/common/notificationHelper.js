const Merchant = require("../models/Merchant");
const Order = require("../models/Order");
const Booking = require("../models/Booking");
const Customer = require("../models/Customer");

const NotificationService = require('../services/notificationService');
const Checker = require('../common/checker');
const Constants = require('../common/constants');
const Advertisement = require("../models/Advertisement");

module.exports = {
  /**
   * SEND NOTI ABOUT MERCHANT APPLICATION
   */
  //send notification when staff receives a new merchant application
  notificationNewApplication: async(id) => {
    let merchant = await Merchant.findByPk(id);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);
    
    let title = 'New Merchant Application';
    let description = 'A new merchant application from ' + merchant.name + ' requires attention.';
    
    let senderModel = Constants.ModelEnum.MERCHANT;
    let receiverModel = Constants.ModelEnum.STAFF;
    let senderId = id
    let receiverId = null;
    let forStaff = true;
    await NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId, forStaff });
  },

  //send notification to merchant after staff approves the merchant application
  notificationAccountApproval: async(id) => {
    let merchant = await Merchant.findByPk(id);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound); 

    let title = 'Account Approved';
    let description = 'Your account is approved, you can start posting products!';
    
    let senderModel = Constants.ModelEnum.STAFF;
    let receiverModel = Constants.ModelEnum.MERCHANT;
    let senderId = null
    let receiverId = id;
    await NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId });
  },

  //send notification to merchant after staff approves the merchant application
  notificationAccountDisapproval: async(id) => {
    let merchant = await Merchant.findByPk(id);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound); 

    let title = 'Account Disapproved';
    let description = 'Your account is disapproved, please contact admin!';
    
    let senderModel = Constants.ModelEnum.STAFF;
    let receiverModel = Constants.ModelEnum.MERCHANT;
    let senderId = null
    let receiverId = id;
    await NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId });
  },

  /**
   * SEND NOTI TO CUSTOMER ABOUT BOOKING
   */
  //send notification to customers that booking time starting in 10 minutes
   notificationBookingStartingSoon: async(bookingId, customerId) => {
    
    let customer = await Customer.findByPk(customerId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound); 

    let booking = await Booking.findByPk(bookingId);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound); 

    if(booking.bookingStatusEnum === Constants.BookingStatus.UNFULFILLED) {
      let title = 'Booking Starting';
      let description = 'Your booking with ID: ' + bookingId + ' is starting in 10 minutes';
      
      let senderModel = Constants.ModelEnum.BOOKING;
      let receiverModel = Constants.ModelEnum.CUSTOMER;
      let senderId = bookingId;
      let receiverId = customerId;
      await NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId });
    }
  },
  //send notification to customers that booking time started
   notificationBookingStarted: async(bookingId, customerId) => {
    let customer = await Customer.findByPk(customerId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound); 

    let booking = await Booking.findByPk(bookingId);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound); 
    if(booking.bookingStatusEnum === Constants.BookingStatus.UNFULFILLED) {
      let title = 'Booking Started';
      let description = 'Your booking with ID: ' + bookingId + ' has started';
      
      let senderModel = Constants.ModelEnum.BOOKING;
      let receiverModel = Constants.ModelEnum.CUSTOMER;
      let senderId = bookingId;
      let receiverId = customerId;
      await NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId });
    }
  },
  //send notification to customers that booking time reaching in 10 minutes
   notificationBookingReachingSoon: async(bookingId, customerId) => {
    let customer = await Customer.findByPk(customerId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound); 

    let booking = await Booking.findByPk(bookingId);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound); 

    if(booking.bookingStatusEnum === Constants.BookingStatus.ACTIVE) {
      let title = 'Booking Ending';
      let description = 'Your booking with ID: ' + bookingId + ' is ending in 10 minutes. Additional charges will apply if booking not retrieved in 10 minutes';
      
      let senderModel = Constants.ModelEnum.BOOKING;
      let receiverModel = Constants.ModelEnum.CUSTOMER;
      let senderId = bookingId;
      let receiverId = customerId;
      await NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId });
    }
  },
  //send notification to customer that booking time reached
   notificationBookingReached: async(bookingId, customerId) => {
    let customer = await Customer.findByPk(customerId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound); 

    let booking = await Booking.findByPk(bookingId);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound); 

    if(booking.bookingStatusEnum === Constants.BookingStatus.ACTIVE) {
      let title = 'Booking Ended';
      let description = 'Your booking with ID: ' + bookingId + ' has ended. Additional charges will apply';
      
      let senderModel = Constants.ModelEnum.BOOKING;
      let receiverModel = Constants.ModelEnum.CUSTOMER;
      let senderId = bookingId;
      let receiverId = customerId;
      await NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId });
    }
  },

  notificationBookingExpired: async(bookingId, customerId) => {
    let customer = await Customer.findByPk(customerId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound); 

    let booking = await Booking.findByPk(bookingId);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound); 

    if(booking.bookingStatusEnum === Constants.BookingStatus.UNFULFILLED) {
      let title = 'Your booking has expired';
      let description = 'Your booking with ID: ' + bookingId + ' has expired. Credits will not be refunded';
      
      let senderModel = Constants.ModelEnum.BOOKING;
      let receiverModel = Constants.ModelEnum.CUSTOMER;
      let senderId = bookingId;
      let receiverId = customerId;

      await booking.update({ bookingStatusEnum: Constants.bookingstatus.EXPIRED });

      await NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId });

    }
  },

  //send notification about adding a collector
  notificationCollectorAdded: async(bookingId, collectorId) => {
    let collector = await Customer.findByPk(collectorId);
    Checker.ifEmptyThrowError(collector, Constants.Error.CustomerNotFound); 

    let booking = await Booking.findByPk(bookingId);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound); 

    if(booking.bookingStatusEnum === Constants.BookingStatus.UNFULFILLED) {
      let title = 'You are added to booking ' + bookingId + ' as collector';
      let description = 'Scan QR code to open locker';
      
      let senderModel = Constants.ModelEnum.BOOKING;
      let receiverModel = Constants.ModelEnum.CUSTOMER;
      let senderId = bookingId;
      let receiverId = collectorId;

      await NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId });

    }
  },

  //send notification about removal of collector
  notificationCollectorRemoved: async(bookingId, collectorId) => {
    let collector = await Customer.findByPk(collectorId);
    Checker.ifEmptyThrowError(collector, Constants.Error.CustomerNotFound); 

    let booking = await Booking.findByPk(bookingId);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound); 

    if(booking.bookingStatusEnum === Constants.BookingStatus.UNFULFILLED) {
      let title = 'You are removed from booking';
      let description = 'You are no longer a collector for booking' + bookingId;
      
      let senderModel = Constants.ModelEnum.BOOKING;
      let receiverModel = Constants.ModelEnum.CUSTOMER;
      let senderId = bookingId;
      let receiverId = collectorId;

      await NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId });

    }
  },


  /**
   * SEND NOTI TO MERCHANT ABOUT BOOKING
   */
  //send notification to customers that booking time starting in 10 minutes
  notificationBookingStartingSoonMerchant: async(bookingId, merchantId) => {
    let merchant = await Merchant.findByPk(merchantId);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound); 

    let booking = await Booking.findByPk(bookingId);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound); 

    if(booking.bookingStatusEnum === Constants.BookingStatus.UNFULFILLED) {
      let title = 'Booking Starting';
      let description = 'Your booking with ID: ' + bookingId + ' is starting in 10 minutes';
      
      let senderModel = Constants.ModelEnum.BOOKING;
      let receiverModel = Constants.ModelEnum.MERCHANT;
      let senderId = bookingId;
      let receiverId = merchantId;
      await NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId });
    }
  },
  //send notification to customers that booking time started
   notificationBookingStartedMerchant: async(bookingId, merchantId) => {
    let merchant = await Merchant.findByPk(merchantId);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound); 

    let booking = await Booking.findByPk(bookingId);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound); 

    if(booking.bookingStatusEnum === Constants.BookingStatus.UNFULFILLED) {
      let title = 'Booking Starting';
      let description = 'Your booking with ID: ' + bookingId + ' has started';
      
      let senderModel = Constants.ModelEnum.BOOKING;
      let receiverModel = Constants.ModelEnum.MERCHANT;
      let senderId = bookingId;
      let receiverId = merchantId;
      await NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId });
    }
  },
  //send notification to customers that booking time reaching in 10 minutes
   notificationBookingReachingSoonMerchant: async(bookingId, merchantId) => {
    let merchant = await Merchant.findByPk(merchantId);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound); 

    let booking = await Booking.findByPk(bookingId);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound); 

    if(booking.bookingStatusEnum === Constants.BookingStatus.ACTIVE) {
      let title = 'Booking Ending';
      let description = 'Your booking with ID: ' + bookingId + ' is ending in 10 minutes. Additional charges will apply if booking not retrieved in 10 minutes';
      
      let senderModel = Constants.ModelEnum.BOOKING;
      let receiverModel = Constants.ModelEnum.MERCHANT;
      let senderId = bookingId;
      let receiverId = merchantId;
      await NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId });
    }
  },
  //send notification to customer that booking time reached
   notificationBookingReachedMerchant: async(bookingId, merchantId) => {
    let merchant = await Merchant.findByPk(merchantId);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound); 

    let booking = await Booking.findByPk(bookingId);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound); 
    
    if(booking.bookingStatusEnum === Constants.BookingStatus.ACTIVE) {
      let title = 'Booking Ended';
      let description = 'Your booking with ID: ' + bookingId + ' has ended. Additional charges will apply';
      
      let senderModel = Constants.ModelEnum.BOOKING;
      let receiverModel = Constants.ModelEnum.MERCHANT;
      let senderId = bookingId;
      let receiverId = merchantId;
      await NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId });
    }
  },


  /**
   * SEND NOTI ABOUT ORDER
   */

  //send notification to merchant of new order
  notificationNewOrder : async(orderId, merchantId) => {
    let order = await Order.findByPk(orderId);
    Checker.ifEmptyThrowError(order, Constants.Error.OrderNotFound); 

    let merchant = await Merchant.findByPk(merchantId);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);

    let title = 'New Order';
    let description = 'You have a new order';
    
    let senderModel = Constants.ModelEnum.ORDER;
    let receiverModel = Constants.ModelEnum.MERCHANT;
    let senderId = orderId;
    let receiverId = merchantId;
    await NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId });
  },
  //send notifications to merchants that customer has received the order
   notificationOrderReceivedMerchant: async(orderId, merchantId) => {
    let order = await Order.findByPk(orderId);
    Checker.ifEmptyThrowError(order, Constants.Error.OrderNotFound); 

    let merchant = await Merchant.findByPk(merchantId);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);

    let title = 'Order items received by customer';
    let description = 'Order items with order ID: ' + orderId + ' is collected by customer';
    
    let senderModel = Constants.ModelEnum.ORDER;
    let receiverModel = Constants.ModelEnum.MERCHANT;
    let senderId = orderId;
    let receiverId = merchantId;
    await NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId });
  },
  //send notifications to customer that the order is ready
  notificationOrderReadyForCollection: async(orderId, customerId) => {
    let order = await Order.findByPk(orderId);
    Checker.ifEmptyThrowError(order, Constants.Error.OrderNotFound); 

    let customer = await Customer.findByPk(customerId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);

    let title = 'Order Ready For Collection';
    let description = 'Your order with ID: ' + orderId + ' is ready to be collected';
    
    let senderModel = Constants.ModelEnum.ORDER;
    let receiverModel = Constants.ModelEnum.CUSTOMER;
    let senderId = orderId;
    let receiverId = customerId;
    await NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId });
  },

  /**
   * SEND NOTIFICATION ABOUT ADVERTISEMENT
   */

   //send notification to staff about new advertisement from merchant 
   notificationNewAdvertisementApplicationFromMerchant: async(advertisementId, transaction) => {
    let advertisement = await Advertisement.findByPk(advertisementId, { transaction });
    Checker.ifEmptyThrowError(advertisement, Constants.Error.AdvertisementNotFound);
    
    let title = 'New Advertisement Application';
    let description = 'A new advertisement application requires attention';
    
    let senderModel = Constants.ModelEnum.ADVERTISEMENT;
    let receiverModel = Constants.ModelEnum.STAFF;
    let senderId = advertisementId
    let receiverId = null;
    let forStaff = true;
    await NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId, forStaff }, transaction);
  },

   //send notification to staff about new advertisement from advertisers
   notificationNewAdvertisementApplicationFromAdvertiser: async(advertisementId, transaction) => {
    let advertisement = await Advertisement.findByPk(advertisementId, { transaction });
    Checker.ifEmptyThrowError(advertisement, Constants.Error.AdvertisementNotFound);
    
    let title = 'New Advertisement Application';
    let description = 'A new advertisement application requires attention';
    
    let senderModel = Constants.ModelEnum.ADVERTISEMENT;
    let receiverModel = Constants.ModelEnum.STAFF;
    let senderId = advertisementId
    let receiverId = null;
    let forStaff = true;
    await NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId, forStaff }, transaction);
  },

   //send notification for merchants about advertisement approval
   notificationAdvertisementApproved: async(merchantId, advertisementId) => {
    let merchant = await Merchant.findByPk(merchantId);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound); 

    let advertisement = await Advertisement.findByPk(advertisementId);
    Checker.ifEmptyThrowError(advertisement, Constants.Error.AdvertisementNotFound); 

    let title = 'Your advertisment is approved';
    let description = 'Your advertisement ' + advertisementId + ' is approved!';
    
    let senderModel = Constants.ModelEnum.ADVERTISEMENT;
    let receiverModel = Constants.ModelEnum.MERCHANT;
    let senderId = advertisementId
    let receiverId = merchantId;
    await NotificationService.createNotification({ title, description, receiverModel, senderModel, senderId, receiverModel, receiverId });
   },
}