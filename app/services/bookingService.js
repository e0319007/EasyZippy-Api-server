const Checker = require('../common/checker');
const Constants = require('../common/constants');
var QRCode = require('qrcode')
const CustomError = require('../common/error/customError');

const Booking = require('../models/Booking')
const Promotion = require('../models/Promotion');
const Merchant = require('../models/Merchant');
const Customer = require('../models/Customer');
const BookingPackage = require('../models/BookingPackage');
const BookingPackageModel = require('../models/BookingPackageModel');

const retrieveAvailableLockers = async(lockerTypeId) => {

}

module.exports = {
  // should qr code be generated on the front end?
  // backend store a randomly generated string, 
  // front end retrieve the string and make it into a qr code,
  // after scan, map back to the string and send to backend to open locker,

  createBookingByCustomer: async(bookingData, transaction) => {
    let { promoIdUsed, startDate, endDate, bookingSourceEnum, customerId} = bookingData;
    let booking;
    let qrCode = Math.random().toString(36).substring(20);
    if (!Checker.isEmpty(promoIdUsed)) Checker.ifEmptyThrowError(await Promotion, Constants.Error.PromotionNotFound)
    startDate = Date.parse(startDate);
    endDate = Date.parse(endDate);
    if(startDate > endDate) throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    Checker.ifEmptyThrowError(customerId, 'Customer ' + Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(await Customer.findByPk(customerId), Constants.Error.CustomerNotFound);
    Checker.ifEmptyThrowError(bookingSourceEnum, 'Booking Source ' + Constants.Error.XXXIsRequired);

    booking = await Booking.create({ promoIdUsed, startDate, endDate, bookingSourceEnum, customerId, qrCode }, { transaction })
  },
  
  createBookingByMerchant: async(bookingData, transaction) => {
    let { promoIdUsed, startDate, endDate, bookingSourceEnum, merchantId} = bookingData;
    let booking;
    let qrCode = Math.random().toString(36).substring(20);
    if (!Checker.isEmpty(promoIdUsed)) Checker.ifEmptyThrowError(await Promotion, Constants.Error.PromotionNotFound)
    startDate = Date.parse(startDate);
    endDate = Date.parse(endDate);
    if(startDate > endDate) throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    Checker.ifEmptyThrowError(merchantId, 'Merchant ' + Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(await Merchant.findByPk(id), Constants.Error.MerchantNotFound);
    Checker.ifEmptyThrowError(bookingSourceEnum, 'Booking Source ' + Constants.Error.XXXIsRequired);

    booking = await Booking.create({ promoIdUsed, startDate, endDate, bookingSourceEnum, merchantId, qrCode }, { transaction });
  },


  createBookingWithBookingPackageByCustomer: async(bookingData, transaction) => {
    let { promoIdUsed, startDate, endDate, bookingSourceEnum, customerId, bookingPackageId} = bookingData;
    let booking;
    let qrCode = Math.random().toString(36).substring(20);
    if (!Checker.isEmpty(promoIdUsed)) Checker.ifEmptyThrowError(await Promotion, Constants.Error.PromotionNotFound)
    startDate = Date.parse(startDate);
    endDate = Date.parse(endDate);
    if(startDate > endDate) throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    Checker.ifEmptyThrowError(customerId, 'Customer ' + Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(await Customer.findByPk(customerId), Constants.Error.CustomerNotFound);
    Checker.ifEmptyThrowError(bookingSourceEnum, 'Booking Source ' + Constants.Error.XXXIsRequired);
    
    Checker.ifEmptyThrowError(bookingPackageId, 'Booking package ' + Constants.Error.IdRequired);
    //Check if booking package belongs to the customer
    let bookingPackage = await BookingPackage.findOne({ where: { bookingPackageId, customerId } });
    Checker.ifEmptyThrowError(bookingPackage, 'Booking package ' + Constants.Error.IdRequired);
    //Check booking package availability
    if(bookingPackage.lockerCount >= (await BookingPackageModel.findByPk(bookingPackage.bookingPackageModelId).quota)) {
      throw new CustomError(Constants.Error.BookingPackageReachedMaximumLockerCount);
    }

    bookingPackage = await BookingPackage.update({ lockerCount: ++bookingPackage.lockerCount }, { where: { id: bookingPackageId }, transaction });
    booking = await Booking.create({ promoIdUsed, startDate, endDate, bookingSourceEnum, customerId, qrCode, bookingPackageId }, { transaction });

    return booking;
  },

  createBookingWithBookingPackageByMerchant: async(bookingData, transaction) => {
    let { promoIdUsed, startDate, endDate, bookingSourceEnum, merchantId, bookingPackageId} = bookingData;
    let booking;
    let qrCode = Math.random().toString(36).substring(20);
    if (!Checker.isEmpty(promoIdUsed)) Checker.ifEmptyThrowError(await Promotion, Constants.Error.PromotionNotFound)
    startDate = Date.parse(startDate);
    endDate = Date.parse(endDate);
    if(startDate > endDate) throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    Checker.ifEmptyThrowError(merchantId, 'Merchant ' + Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(await Merchant.findByPk(id), Constants.Error.MerchantNotFound);
    Checker.ifEmptyThrowError(bookingSourceEnum, 'Booking Source ' + Constants.Error.XXXIsRequired);

    Checker.ifEmptyThrowError(bookingPackageId, 'Booking package ' + Constants.Error.IdRequired);
    //Check if booking package belongs to the merchant
    let bookingPackage = await BookingPackage.findOne({ where: { bookingPackageId, merchantId } });
    Checker.ifEmptyThrowError(bookingPackage, 'Booking package ' + Constants.Error.IdRequired);
    //Check booking package availability
    if(bookingPackage.lockerCount >= (await BookingPackageModel.findByPk(bookingPackage.bookingPackageModelId).quota)) {
      throw new CustomError(Constants.Error.BookingPackageReachedMaximumLockerCount);
    }

    bookingPackage = await BookingPackage.update({ lockerCount: ++bookingPackage.lockerCount }, { where: { id: bookingPackageId }, transaction });
    booking = await Booking.create({ promoIdUsed, startDate, endDate, bookingSourceEnum, merchantId, qrCode, bookingPackageId }, { transaction });

    return booking;
    },

  // retrieveQrCode: async(id) => {
  //   let booking = await Booking.findByPk(id);
  //   booking.qrCode
  // },
  
  //assign lockers

  retrieveBookingById: async(id) => {
    let booking = await Booking.findByPk(id);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound);
    return booking;
  },

  retrieveBookingByCustomerId: async(customerId) => {
    return await Booking.findAll({ where: { customerId } });
  },

  retrieveBookingByMerchantId: async(merchantId) => {
    return await Booking.findAll({ where: { merchantId } });
  },

  retrieveBookingByOrderId: async(orderId) => {
    return await Booking.findAll({ where: { orderId } });
  },

  cancelBooking: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired)
    let booking = await Booking.findByPk(id);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound);
    
    if(booking.bookingStatusEnum != 'Unfufilled') 
      throw CustomError(Constants.Error.BookingCannotBeCancelled)

    booking = await Booking.update({ 
      bookingStatusEnum: Constants.BookingStatus.Cancelled 
    }, { where: { id }, transaction })
    return booking;
  },

}