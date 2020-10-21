const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');
const Customer = require('../models/Customer');
const Merchant = require('../models/Merchant');
const BookingPackage = require('../models/BookingPackage');
const BookingPackageModel = require('../models/BookingPackageModel');
const CreditPaymentRecordService = require('../services/creditPaymentRecordService');
const Locker = require('../models/Locker');

module.exports = {
  createBookingPackageForCustomer: async(bookingPackageData, transaction) => {
    let { customerId, bookingPackageModelId } = bookingPackageData;

    if(Checker.isEmpty(customerId)) {
      console.log(bookingPackageData)
      throw new CustomError('Customer ' + Constants.Error.IdRequired)
    }
    Checker.ifEmptyThrowError(await Customer.findByPk(customerId), Constants.Error.CustomerNotFound);

    // ONLY CAN BUY ONE BOOKING PACKAGE
    if(!Checker.isEmpty(await BookingPackage.findAll({ customerId, expired: false }))) {
      throw new CustomError(Constants.Error.BookingPackageCannotBeSold);
    }

    Checker.ifEmptyThrowError(bookingPackageModelId, 'Booking package model ' + Constants.Error.IdRequired)
    let bookingPackageModel = await BookingPackageModel.findByPk(bookingPackageModelId);
    let lockerTypeId = bookingPackageModel.lockerTypeId;
    Checker.ifEmptyThrowError(bookingPackageModel, Constants.Error.BookingPackageModelNotFound);
    let creditPaymentRecord = await CreditPaymentRecordService.payCreditCustomer(customerId, bookingPackageModel.price, transaction);
    let creditPaymentRecordId = creditPaymentRecord.id;
    
    // add in check for overselling 
    let bookingPackageModels = await BookingPackageModel.findAll({ where: { lockerTypeId } });
    let bookingPackageCount = 0;
    for(const bpm of bookingPackageModels) {
      //let bookingPackage = await BookingPackage.findAll({ where: { bookingPackageModelId: bpm.id } });
      let bookingPackages = await bpm.getBookingPackages();
      let availBookingPackage = new Array();
      for(let bp of bookingPackages) {
        if(bp.endDate > new Date()) availBookingPackage.push(bp);
      }
      bookingPackageCount += availBookingPackage.length * bpm.quota;
    }
    if (bookingPackageCount + bookingPackageModel.quota > (await Locker.findAll({ where: { lockerTypeId } })).length) {
      throw new CustomError(Constants.Error.BookingPackageSoldOut);
    }
    // end in check for overselling 

    let startDate = new Date();
    let endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + bookingPackageModel.duration);
   
    let bookingPackage = await BookingPackage.create({ customerId, creditPaymentRecordId, bookingPackageModelId, startDate, endDate }, { transaction });
    return bookingPackage;
  },

  createBookingPackageForMerchant: async(bookingPackageData, transaction) => {
    let { merchantId, bookingPackageModelId } = bookingPackageData;
    Checker.ifEmptyThrowError(merchantId, 'Merchant ' + Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(await Customer.findByPk(merchantId), Constants.Error.CustomerNotFound);

    // ONLY CAN BUY ONE BOOKING PACKAGE
    if(!Checker.isEmpty(await BookingPackage.findAll({ merchantId, expired: false }))) {
      throw new CustomError(Constants.Error.BookingPackageCannotBeSold);
    }

    Checker.ifEmptyThrowError(bookingPackageModelId, 'Booking package model ' + Constants.Error.IdRequired)
    let bookingPackageModel = await BookingPackageModel.findByPk(bookingPackageModelId);
    let lockerTypeId = bookingPackageModel.lockerTypeId;
    Checker.ifEmptyThrowError(bookingPackageModel, Constants.Error.BookingPackageModelNotFound);
    
    let creditPaymentRecord = await CreditPaymentRecordService.payCreditMerchant(merchantId, bookingPackageModel.price, transaction);
    let creditPaymentRecordId = creditPaymentRecord.id;

    // add in check for overselling 
    let bookingPackageModels = await BookingPackageModel.findAll({ where: { lockerTypeId } });
    let bookingPackageCount = 0;
    for(const bpm of bookingPackageModels) {
      //let bookingPackage = await BookingPackage.findAll({ where: { bookingPackageModelId: bpm.id } });
      let bookingPackages = await bpm.getBookingPackages();
      let availBookingPackage = new Array();
      for(let bp of bookingPackages) {
        if(bp.endDate > new Date()) availBookingPackage.push(bp);
      }
      bookingPackageCount += availBookingPackage.length * bpm.quota;
    }
    if (bookingPackageCount + bookingPackageModel.quota > (await Locker.findAll({ where: { lockerTypeId } })).length) {
      throw new CustomError(Constants.Error.BookingPackageSoldOut);
    }
    // end in check for overselling 

    let startDate = new Date();
    let endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + bookingPackageModel.duration);

    let bookingPackage = await BookingPackage.create({ merchantId, creditPaymentRecordId, bookingPackageModelId, startDate, endDate }, { transaction });
    return bookingPackage;
  },

  retrieveAllBookingPackageByCustomerId: async(customerId) => {
    Checker.ifEmptyThrowError(customerId, Constants.Error.IdRequired);
    const customer = await Customer.findByPk(customerId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);
    
    return await BookingPackage.findAll({ where: { customerId } });
  },

  retrieveCurrentBookingPackageByCustomerId: async(customerId) => {
    Checker.ifEmptyThrowError(customerId, Constants.Error.IdRequired);
    const customer = await Customer.findByPk(customerId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);
    
    return await BookingPackage.findOne({ where: { customerId, expired: false } });
  },

  retrieveAllBookingPackageByMerchantId: async(merchantId) => {
    Checker.ifEmptyThrowError(merchantId, Constants.Error.IdRequired);
    const merchant = await Merchant.findByPk(merchantId);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);

    return await BookingPackage.findAll({ where: { merchantId } });
  },

  retrieveCurrentBookingPackageByMerchantId: async(merchantId) => {
    Checker.ifEmptyThrowError(merchantId, Constants.Error.IdRequired);
    const merchant = await Merchant.findByPk(merchantId);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);

    return await BookingPackage.findOne({ where: { merchantId, expired: false } });
  },

  retrieveBookingPackageByBookingPackageId: async(id) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    const bookingPackage = await BookingPackage.findByPk(id);
    Checker.ifEmptyThrowError(bookingPackage, Constants.Error.BookingPackageNotFound);

    return bookingPackage;
  }
};