const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');

const Booking = require('../models/Booking')
const Promotion = require('../models/Promotion');
const Merchant = require('../models/Merchant');
const Customer = require('../models/Customer');
const BookingPackage = require('../models/BookingPackage');
const BookingPackageModel = require('../models/BookingPackageModel');
const LockerService = require('./lockerService');
const Locker = require('../models/Locker');
const LockerType = require('../models/LockerType');
const CreditPaymentRecordService = require('./creditPaymentRecordService');

const checkBookingAvailable = async(startTime, endTime, lockerTypeId) => {
  let bookings = await Booking.findAll({ where: { lockerTypeId } });
  let lockers = await Locker.findAll({ where: { lockerTypeId } });

  let bookingPackageModels = await BookingPackageModel.findAll({ where: { lockerTypeId } });
  let bookingPackageCount = 0;
  for(const bpm of bookingPackageModels) {
    //let bookingPackage = await BookingPackage.findAll({ where: { bookingPackageModelId: bpm.id } });
    let bookingPackages = await bpm.getBookingPackages();
    let availBookingPackage = new Array();
    //check for non-expired booking packages only
    for(let bp of bookingPackages) {
      if(bp.endDate > new Date()) availBookingPackage.push(bp);
    }
    bookingPackageCount += availBookingPackage.length() * bpm.quota;
  }
 
  let availLockersOfType = lockers.length() - bookingPackageCount;
  for(const b of bookings) {
    if(!((endTime + 1800000 < b.startTime) || (startTime - 1800000 > b.endTime))) {
      availLockersOfType--;
    }
  }
  if (availLockersOfType > 0) {
    return calculatePrice(startTime, endTime, lockerTypeId)
  } 
  return null;
}

const calculatePrice = async(startTime, endTime, lockerTypeId) => {
  let pricePerMilliSecond = (await LockerType.findByPk(lockerTypeId)).price / 1800000;
  let duration = endTime - startTime;
  return duration * pricePerMilliSecond;
}

module.exports = {
  // should qr code be generated on the front end?
  // backend store a randomly generated string, 
  // front end retrieve the string and make it into a qr code,
  // after scan, map back to the string and send to backend to open locker,

  createBookingByCustomer: async(bookingData, transaction) => {
    let { promoIdUsed, startDate, endDate, bookingSourceEnum, customerId, lockerTypeId} = bookingData;
    let booking;

    let bookingPrice = checkBookingAvailable(startTime, endTime, lockerTypeId);
    if (Checker.isEmpty(price)) throw new CustomError(Constants.Error.NoLockersAvailable);

    let qrCode = Math.random().toString(36).substring(20);
    while (!Checker.isEmpty(await Booking.findOne({ where: { qrCode } }))) {
      qrCode = Math.random().toString(36).substring(20);
    }
    
    if (!Checker.isEmpty(promoIdUsed)) Checker.ifEmptyThrowError(await Promotion, Constants.Error.PromotionNotFound)
    startDate = Date.parse(startDate);
    endDate = Date.parse(endDate);
    if(startDate > endDate) throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    Checker.ifEmptyThrowError(customerId, 'Customer ' + Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(await Customer.findByPk(customerId), Constants.Error.CustomerNotFound);
    Checker.ifEmptyThrowError(bookingSourceEnum, 'Booking Source ' + Constants.Error.XXXIsRequired);

    let creditPaymentRecord = await CreditPaymentRecordService.payCreditCustomer(customerId, bookingPrice, transaction);
    let creditPaymentRecordId = creditPaymentRecord.id;
    booking = await Booking.create({ promoIdUsed, startDate, endDate, bookingSourceEnum, customerId, qrCode, lockerTypeId, bookingPrice, creditPaymentRecordId }, { transaction })
  },
  
  createBookingByMerchant: async(bookingData, transaction) => {
    let { promoIdUsed, startDate, endDate, bookingSourceEnum, merchantId, lockerTypeId} = bookingData;
    let booking;

    let bookingPrice = checkBookingAvailable(startTime, endTime, lockerTypeId);
    if (Checker.isEmpty(price)) throw new CustomError(Constants.Error.NoLockersAvailable);
    
    let qrCode = Math.random().toString(36).substring(20);
    while (!Checker.isEmpty(await Booking.findOne({ where: { qrCode } }))) {
      qrCode = Math.random().toString(36).substring(20);
    }
    
    if (!Checker.isEmpty(promoIdUsed)) Checker.ifEmptyThrowError(await Promotion, Constants.Error.PromotionNotFound)
    startDate = Date.parse(startDate);
    endDate = Date.parse(endDate);
    if(startDate > endDate) throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    Checker.ifEmptyThrowError(merchantId, 'Merchant ' + Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(await Merchant.findByPk(id), Constants.Error.MerchantNotFound);
    Checker.ifEmptyThrowError(bookingSourceEnum, 'Booking Source ' + Constants.Error.XXXIsRequired);

    let creditPaymentRecord = await CreditPaymentRecordService.payCreditMerchant(merchantId, bookingPrice, transaction);
    let creditPaymentRecordId = creditPaymentRecord.id;

    booking = await Booking.create({ promoIdUsed, startDate, endDate, bookingSourceEnum, merchantId, qrCode, lockerTypeId, bookingPrice, creditPaymentRecordId }, { transaction });
  },


  createBookingWithBookingPackageByCustomer: async(bookingData, transaction) => {
    let { promoIdUsed, startDate, endDate, bookingSourceEnum, customerId, bookingPackageId} = bookingData;
    let booking;

    let qrCode = Math.random().toString(36).substring(20);
    while (!Checker.isEmpty(await Booking.findOne({ where: { qrCode } }))) {
      qrCode = Math.random().toString(36).substring(20);
    }
    
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
    booking = await Booking.create({ promoIdUsed, startDate, endDate, bookingSourceEnum, customerId, qrCode, bookingPackageId, lockerTypeId: bookingPackage.lockerTypeId}, { transaction });

    return booking;
  },

  createBookingWithBookingPackageByMerchant: async(bookingData, transaction) => {
    let { promoIdUsed, startDate, endDate, bookingSourceEnum, merchantId, bookingPackageId} = bookingData;
    let booking;

    let qrCode = Math.random().toString(36).substring(20);
    while (!Checker.isEmpty(await Booking.findOne({ where: { qrCode } }))) {
      qrCode = Math.random().toString(36).substring(20);
    }    
    
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
    booking = await Booking.create({ promoIdUsed, startDate, endDate, bookingSourceEnum, merchantId, qrCode, bookingPackageId, lockerTypeId: bookingPackage.lockerTypeId }, { transaction });

    return booking;
  },
  
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