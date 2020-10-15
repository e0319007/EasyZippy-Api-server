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
const Order = require('../models/Order');
const { order } = require('paypal-rest-sdk');
const { copySync } = require('fs-extra');
const cons = require('consolidate');

const checkBookingAvailable = async(startDate, endDate, lockerTypeId) => {
  let bookings = await Booking.findAll({ where: { lockerTypeId } });
  let lockers = await Locker.findAll({ where: { lockerTypeId } });

  let bookingPackageModels = await BookingPackageModel.findAll({ where: { lockerTypeId } });
  let bookingPackageCount = 0;

  /*
  CURRENTLY FIRST COME FIRST SERVE
  ADD LOGIC TO PUT CONSTRAINT -->
  for(const bpm of bookingPackageModels) {
    //let bookingPackage = await BookingPackage.findAll({ where: { bookingPackageModelId: bpm.id } });
    let bookingPackages = await bpm.getBookingPackages();
    let availBookingPackage = new Array();
    //check for non-expired booking packages only
    for(let bp of bookingPackages) {
      if(bp.endDate > new Date()) availBookingPackage.push(bp);
    }
    bookingPackageCount += availBookingPackage.length * bpm.quota;
  }
  */

  //determine quota of instant bookings
  let availLockersOfType = lockers.length - bookingPackageCount;

  //time array
  let minutes = Math.floor((endDate.getTime() - startDate.getTime())/ 1000 / 60);
  //add 1 when 1 slot taken
  let emptyTimes = new Array(minutes).fill(0);
  for(const b of bookings) { 
    if (b.startDate <= startDate && b.endDate >= startDate && b.endDate <= endDate) {
      // currBooking:   |----|
      // b.booking  :|----|  
      console.log('A')
      let gap = parseInt(Math.abs(b.endDate.getTime() - startDate.getTime()) / (1000 * 60));
      for(let i = 0; i < gap; i++) {
        emptyTimes[i] = ++emptyTimes[i];
      }
    }else if (b.startDate >= startDate && b.startDate <= endDate && b.endDate >= endDate) {
    // currBooking:|----|
    // b.booking  :   |----| 
      console.log('B')  
      let startGap = parseInt(Math.abs(b.startDate.getTime() - startDate.getTime()) / (1000 * 60));
      for(let i = startGap; i < emptyTimes.length; i++) {
        emptyTimes[i] = ++emptyTimes[i];
      }
    } else if (b.startDate >= startDate && b.endDate <= endDate) {
      // currBooking:|----|
      // b.booking  : |--|  
        console.log('C') 
      let startGap = parseInt(Math.abs(b.startDate.getTime() - startDate.getTime()) / (1000 * 60));
      let gap = parseInt(Math.abs(b.endDate.getTime() - startDate.getTime()) / (1000 * 60));
      for(let i = startGap; i < gap; i++) {
        emptyTimes[i] = ++emptyTimes[i];
      }
    } else if (b.startDate <= startDate && b.endDate >= endDate) {
      // currBooking: |--|
      // b.booking  :|----| 
      console.log('D')
      for(let i = 0; i < emptyTimes.length; i++) {
        emptyTimes[i] = ++emptyTimes[i];
      }
    } 
  }
  let availableSlots = new Array();
  let i = 0;
  let j = 0;
  while(i < emptyTimes.length) {
    let availableStartDate = null
    let availableEndDate;
    let duration = 0;
    j = i;
    while(emptyTimes[j] < availLockersOfType) {
      availableStartDate = new Date(startDate.getTime() + i * 60000)
      duration++; 
      j++;
    }
    if(availableStartDate != null) {
      //console.log(duration)
      availableEndDate = new Date(availableStartDate.getTime() + duration * 60000);
      availableSlot = {
        'startDate': availableStartDate,
        'endDate': availableEndDate
      };
      availableSlots.push(availableSlot);
      // console.log('availableStartDate: ' + availableStartDate )
      // console.log('availableEndDate: ' +  availableEndDate)
    }
    i = j + 1;
  };

  //console.log(availableSlot)
  return availableSlots;
}

const calculatePrice = async(startDate, endDate, lockerTypeId) => {
  let pricePerMilliSecond = (await LockerType.findByPk(lockerTypeId)).price / 1800000;
  let duration = endDate - startDate;
  return duration * pricePerMilliSecond;
}

const applyPromoId = async(promoIdUsed) => {
  if(!Checker.isEmpty(promoIdUsed)) {
    let promotion = await Promotion.findByPk(promoIdUsed);
    Checker.ifEmptyThrowError(promotion, Constants.Error.PromotionNotFound);
    if(promotion.startDate <= new Date() && promotion.endDate >= new Date()) {
      if(!Checker.isEmpty(promotion.flatDiscount)) {
        bookingPrice -= promotion.flatDiscount;
      } else {
        bookingPrice *= (1 - promotion.percentageDiscount);
      }
    }
  } 
  return bookingPrice;
}

module.exports = {
  // should qr code be generated on the front end?
  // backend store a randomly generated string, 
  // front end retrieve the string and make it into a qr code,
  // after scan, map back to the string and send to backend to open locker,

  createBookingByCustomer: async(bookingData, transaction) => {
    let { promoIdUsed, startDate, endDate, bookingSourceEnum, customerId, lockerTypeId} = bookingData;
    /* CHECK WHAT FORMAT DATE IS PASSED IN FIRST */
    // startDate = Date.parse(startDate);
    // endDate = Date.parse(endDate);
    if(startDate > endDate) throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    Checker.ifEmptyThrowError(customerId, 'Customer ' + Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(await Customer.findByPk(customerId), Constants.Error.CustomerNotFound);
    Checker.ifEmptyThrowError(bookingSourceEnum, 'Booking Source ' + Constants.Error.XXXIsRequired);

    let bookingPrice = await calculatePrice(startDate, endDate, lockerTypeId);
    let availSlots = await checkBookingAvailable(startDate, endDate, lockerTypeId);
    if(Checker.isEmpty(availSlots)) {
      throw new CustomError(Constants.Error.BookingCannotBeMade)
    } else if (availSlots[0].startDate.getTime() != startDate.getTime() || availSlots[0].endDate.getTime() != endDate.getTime()) {
      return availSlots;
    }

    //PROMOTION
    if(!Checker.isEmpty(promoIdUsed)) {
      bookingPrice = await applyPromoId(promoIdUsed)
    } 
    bookingPrice = bookingPrice.toFixed(2);

    //QR CODE
    let qrCode = Math.random().toString(36).substring(2);
    while (!Checker.isEmpty(await Booking.findOne({ where: { qrCode } }))) {
      qrCode = Math.random().toString(36).substring(2);
    }
    
    //CREDIT PAYMENT
    let creditPaymentRecord = await CreditPaymentRecordService.payCreditCustomer(customerId, bookingPrice, transaction);
    let creditPaymentRecordId = creditPaymentRecord.id;

    let booking = await Booking.create({ promoIdUsed, startDate, endDate, bookingSourceEnum, customerId, qrCode, lockerTypeId, bookingPrice, creditPaymentRecordId }, { transaction })
    return booking;
  },
  
  createBookingByMerchant: async(bookingData, transaction) => {
    let { promoIdUsed, startDate, endDate, bookingSourceEnum, merchantId, lockerTypeId} = bookingData;
    /* CHECK WHAT FORMAT DATE IS PASSED IN FIRST */
    // startDate = Date.parse(startDate);
    // endDate = Date.parse(endDate);
    if(startDate > endDate) throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    Checker.ifEmptyThrowError(merchantId, 'Merchant ' + Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(await Merchant.findByPk(merchantId), Constants.Error.MerchantNotFound);
    Checker.ifEmptyThrowError(bookingSourceEnum, 'Booking Source ' + Constants.Error.XXXIsRequired);

    let bookingPrice = await calculatePrice(startDate, endDate, lockerTypeId);
    let availSlots = await checkBookingAvailable(startDate, endDate, lockerTypeId);
    if(Checker.isEmpty(availSlots)) {
      throw new CustomError(Constants.Error.BookingCannotBeMade)
    } else if (availSlots[0].startDate.getTime() != startDate.getTime() || availSlots[0].endDate.getTime() != endDate.getTime()) {
      return availSlots;
    }

    //PROMOTION
    if(!Checker.isEmpty(promoIdUsed)) {
      bookingPrice = await applyPromoId(promoIdUsed)
    } 
    bookingPrice = bookingPrice.toFixed(2);
    
    //QR CODE
    let qrCode = Math.random().toString(36).substring(2);
    while (!Checker.isEmpty(await Booking.findOne({ where: { qrCode } }))) {
      qrCode = Math.random().toString(36).substring(2);
    }

    //CREDIT PAYMENT
    let creditPaymentRecord = await CreditPaymentRecordService.payCreditMerchant(merchantId, bookingPrice, transaction);
    let creditPaymentRecordId = creditPaymentRecord.id;

    let booking = await Booking.create({ promoIdUsed, startDate, endDate, bookingSourceEnum, merchantId, qrCode, lockerTypeId, bookingPrice, creditPaymentRecordId, bookingPrice }, { transaction });
    return booking;
  },


  createBookingWithBookingPackageByCustomer: async(bookingData, transaction) => {
    let { promoIdUsed, startDate, endDate, bookingSourceEnum, customerId, bookingPackageId} = bookingData;
    let booking;

    /* CHECK WHAT FORMAT DATE IS PASSED IN FIRST */
    // startDate = Date.parse(startDate);
    // endDate = Date.parse(endDate);
    if(startDate > endDate) throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    Checker.ifEmptyThrowError(customerId, 'Customer ' + Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(await Customer.findByPk(customerId), Constants.Error.CustomerNotFound);
    Checker.ifEmptyThrowError(bookingSourceEnum, 'Booking Source ' + Constants.Error.XXXIsRequired);
    
    Checker.ifEmptyThrowError(bookingPackageId, 'Booking package ' + Constants.Error.IdRequired);
    //Check if booking package belongs to the customer
    let bookingPackage = await BookingPackage.findOne({ where: { id: bookingPackageId, customerId } });
    Checker.ifEmptyThrowError(bookingPackage, 'Booking package ' + Constants.Error.IdRequired);
    let bookingPackageModel = await BookingPackageModel.findByPk(bookingPackage.bookingPackageModelId);
    //Check booking package availability
    if(bookingPackage.lockerCount >= bookingPackageModel.quota) {
      throw new CustomError(Constants.Error.BookingPackageReachedMaximumLockerCount);
    }
    let bookingPrice = await calculatePrice(startDate, endDate, bookingPackageModel.lockerTypeId);
    let availSlots = await checkBookingAvailable(startDate, endDate, bookingPackageModel.lockerTypeId);
    if(Checker.isEmpty(availSlots)) {
      throw new CustomError(Constants.Error.BookingCannotBeMade)
    } else if (availSlots[0].startDate.getTime() != startDate.getTime() || availSlots[0].endDate.getTime() != endDate.getTime()) {
      return availSlots;
    }

    //PROMOTION
    if(!Checker.isEmpty(promoIdUsed)) {
      bookingPrice = await applyPromoId(promoIdUsed)
    } 
    bookingPrice = bookingPrice.toFixed(2);

    //QR CODE
    let qrCode = Math.random().toString(36).substring(2);
    while (!Checker.isEmpty(await Booking.findOne({ where: { qrCode } }))) {
      qrCode = Math.random().toString(36).substring(2);
    }

    //CREDIT PAYMENT
    let creditPaymentRecord = await CreditPaymentRecordService.payCreditCustomer(customerId, bookingPrice, transaction);
    let creditPaymentRecordId = creditPaymentRecord.id;
    bookingPackage = await BookingPackage.update({ lockerCount: ++bookingPackage.lockerCount }, { where: { id: bookingPackageId }, transaction });
    booking = await Booking.create({ promoIdUsed, startDate, endDate, bookingSourceEnum, customerId, qrCode, bookingPackageId, lockerTypeId: bookingPackageModel.lockerTypeId, bookingPrice, creditPaymentRecordId}, { transaction });

    return booking;
  },


  createBookingWithBookingPackageByMerchant: async(bookingData, transaction) => {
    let { promoIdUsed, startDate, endDate, bookingSourceEnum, merchantId, bookingPackageId} = bookingData;
    let booking;
    /* CHECK WHAT FORMAT DATE IS PASSED IN FIRST */
    // startDate = Date.parse(startDate);
    // endDate = Date.parse(endDate);

    if(startDate > endDate) throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    Checker.ifEmptyThrowError(merchantId, 'Merchant ' + Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(await Merchant.findByPk(merchantId), Constants.Error.MerchantNotFound);
    Checker.ifEmptyThrowError(bookingSourceEnum, 'Booking Source ' + Constants.Error.XXXIsRequired);

    Checker.ifEmptyThrowError(bookingPackageId, 'Booking package ' + Constants.Error.IdRequired);
    //Check if booking package belongs to the merchant
    let bookingPackage = await BookingPackage.findOne({ where: { id: bookingPackageId, merchantId } });
    Checker.ifEmptyThrowError(bookingPackage, 'Booking package ' + Constants.Error.IdRequired);
    let bookingPackageModel = await BookingPackageModel.findByPk(bookingPackage.bookingPackageModelId);
    //Check booking package availability
    if(bookingPackage.lockerCount >= bookingPackageModel.quota) {
      throw new CustomError(Constants.Error.BookingPackageReachedMaximumLockerCount);
    }

    let bookingPrice = await calculatePrice(startDate, endDate, bookingPackageModel.lockerTypeId);
    let availSlots = await checkBookingAvailable(startDate, endDate, bookingPackageModel.lockerTypeId);
    if(Checker.isEmpty(availSlots)) {
      throw new CustomError(Constants.Error.BookingCannotBeMade)
    } else if (availSlots[0].startDate.getTime() != startDate.getTime() || availSlots[0].endDate.getTime() != endDate.getTime()) {
      return availSlots;
    }
    //PROMOTION
    if(!Checker.isEmpty(promoIdUsed)) {
      bookingPrice = await applyPromoId(promoIdUsed)
    } 
    bookingPrice = bookingPrice.toFixed(2);

    //QRCODE
    let qrCode = Math.random().toString(36).substring(2);
    while (!Checker.isEmpty(await Booking.findOne({ where: { qrCode } }))) {
      qrCode = Math.random().toString(36).substring(2);
    }    
    
    //CREDIT PAYMENT
    let creditPaymentRecord = await CreditPaymentRecordService.payCreditCustomer(merchantId, bookingPrice, transaction);
    let creditPaymentRecordId = creditPaymentRecord.id;

    bookingPackage = await BookingPackage.update({ lockerCount: ++bookingPackage.lockerCount }, { where: { id: bookingPackageId }, transaction });
    booking = await Booking.create({ promoIdUsed, startDate, endDate, bookingSourceEnum, merchantId, qrCode, bookingPackageId, lockerTypeId: bookingPackageModel.lockerTypeId, bookingPrice, creditPaymentRecordId }, { transaction });

    return booking;
  },

  //if merchant or customer want to add a order to booking
  tagBookingToOrder: async(id, orderId, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired)
    let booking = await Booking.findByPk(id);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound);

    Checker.ifEmptyThrowError(orderId, 'Order ' + Constants.Error.IdRequired)
    let order = await Order.findByPk(orderId);
    Checker.ifEmptyThrowError(order, Constants.Error.OrderNotFound);

    booking = await booking.update({ orderId }, { transaction });
    return booking;
  },

  //add in a collector 
  addCollectorToBooking: async(id, collectorId, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired)
    let booking = await Booking.findByPk(id);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound);

    Checker.ifEmptyThrowError(collectorId, 'Collector ' + Constants.Error.IdRequired)
    let customer = await Customer.findByPk(collectorId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);
    
    booking = await booking.update({ collectorId }, { transaction });
    return booking;
  }, 

  removeCollectorToBooking: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired)
    let booking = await Booking.findByPk(id);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound);
    
    let qrCode = Math.random().toString(36).substring(2);
    while (!Checker.isEmpty(await Booking.findOne({ where: { qrCode } }))) {
      qrCode = Math.random().toString(36).substring(2);
    }

    booking = await booking.update({ collectorId: null, qrCode }, { transaction });
    return booking;
  }, 

  changeCollectorToBooking: async(id, collectorId, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired)
    let booking = await Booking.findByPk(id);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound);

    Checker.ifEmptyThrowError(collectorId, 'Collector ' + Constants.Error.IdRequired)
    let customer = await Customer.findByPk(collectorId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);

    let qrCode = Math.random().toString(36).substring(2);
    while (!Checker.isEmpty(await Booking.findOne({ where: { qrCode } }))) {
      qrCode = Math.random().toString(36).substring(2);
    }
    
    booking = await booking.update({ collectorId, qrCode }, { transaction });
    return booking;
  }, 

  retrieveBookingById: async(id) => {
    let booking = await Booking.findByPk(id);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound);
    return booking;
  },

  retrieveBookingByCustomerId: async(customerId) => {
    return await Booking.findAll({ where: { customerId } });
  },

  retrieveBookingByCollectorId: async(collectorId) => {
    return await Booking.findAll({ where: { collectorId } });
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
    
    if(booking.bookingStatusEnum != 'Unfufilled' || booking.startDate.getTime() - 30 * 60000 <= new Date().getTime()) {
      console.log(booking.startDate)
      console.log(booking.startDate.getTime())
      console.log(new Date(new Date() - 30 * 60000))
      console.log(new Date(new Date() - 30 * 60000).getTime())
      throw new CustomError(Constants.Error.BookingCannotBeCancelled)
    }

    booking = await Booking.update({ 
    bookingStatusEnum: Constants.BookingStatus.Cancelled 
    }, { where: { id }, transaction });
    return booking;
  },

}






