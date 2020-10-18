const { update } = require('lodash');
const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');
const Booking = require('../models/Booking');
const BookingPackage = require('../models/BookingPackage');
const Kiosk = require('../models/Kiosk');

const Locker = require('../models/Locker');
const LockerType = require('../models/LockerType');
const CreditPaymentRecordService = require('./creditPaymentRecordService');

const assignLockersToBookings = async(bookingId, lockerId, transaction) => {
  await Locker.update( { lockerStatusEnum: 'Empty' }, { where: { id: lockerId }, transaction });
  await Booking.update( { lockerId, bookingStatusEnum: Constants.BookingStatus.Active }, { where: {id: bookingId }, transaction });
};

module.exports = {
  createLocker: async(lockerData, transaction) => {
    const { lockerTypeId, kioskId } = lockerData;
    Checker.ifEmptyThrowError(lockerTypeId, 'Locker type ' + Constants.Error.IdRequired)
    Checker.ifEmptyThrowError(kioskId, 'Kiosk ' + Constants.Error.IdRequired)
    Checker.ifEmptyThrowError(await Kiosk.findByPk(kioskId), Constants.Error.KioskNotFound)
    Checker.ifEmptyThrowError(await Kiosk.findByPk(lockerTypeId), Constants.Error.LockerTypeNotFound)
    return await Locker.create(lockerData, { transaction });
  },

  retrieveLocker: async(id) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    const locker = await Locker.findByPk(id);
    Checker.ifEmptyThrowError(locker, Constants.Error.LockerNotFound);
    Checker.ifDeletedThrowError(locker, Constants.Error.LockerDeleted);

    return locker;
  },

  retrieveAllLockers: async() => {
    return await Locker.findAll({where: { deleted: false } });
  },

  retrieveLockersByLockerType: async(lockerTypeId) => {
    Checker.ifEmptyThrowError(lockerTypeId, Constants.Error.IdRequired);
    const lockerType = await LockerType.findByPk(lockerTypeId);
    Checker.ifEmptyThrowError(lockerType, Constants.Error.LockerTypeNotFound);
    Checker.ifDeletedThrowError(lockerType, Constants.Error.LockerTypeDeleted);

    return await lockerType.getLockers();
  },

  retrieveLockersByKiosk: async(kioskId) => {
    Checker.ifEmptyThrowError(kioskId, Constants.Error.IdRequired);
    const kiosk = await Kiosk.findByPk(kioskId);
    Checker.ifEmptyThrowError(kiosk, Constants.Error.KioskNotFound);
    Checker.ifDeletedThrowError(kiosk, Constants.Error.KioskDeleted);

    return await kiosk.getLockers();
  },

  setLockerEmpty: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    const locker = await Locker.findByPk(id);
    Checker.ifEmptyThrowError(locker, Constants.Error.LockerNotFound);
    Checker.ifDeletedThrowError(locker, Constants.Error.LockerDeleted);

    return await locker.update({ lockerStatusEnum: Constants.LockerStatus.Empty }, { transaction });
  },

  setLockerInUse: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    const locker = await Locker.findByPk(id);
    Checker.ifEmptyThrowError(locker, Constants.Error.LockerNotFound);
    Checker.ifDeletedThrowError(locker, Constants.Error.LockerDeleted);

    return await locker.update({ lockerStatusEnum: Constants.LockerStatus.InUse }, { transaction });
  },

  toggleDisableLocker: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    const locker = await Locker.findByPk(id);
    Checker.ifEmptyThrowError(locker, Constants.Error.LockerNotFound);
    Checker.ifDeletedThrowError(locker, Constants.Error.LockerDeleted);

    return await locker.update({ disabled: !locker.disabled }, { transaction });
  },

  deleteLocker: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    const locker = await Locker.findByPk(id);
    Checker.ifEmptyThrowError(locker, Constants.Error.LockerNotFound);

    await locker.update({ deleted: true }, { transaction });
  },

  retrieveAvailableLockers: async() => {
    return await Locker.findAll({ where: { lockerStatusEnum: 'Empty' } });
  },

  retrieveAvailableLockersByLockerType: async(lockerTypeId) => {
    return await Locker.findAll({ where: { lockerTypeId, lockerStatusEnum: 'Empty' } });
  },

  

  scanOpenLocker: async(qrCode, transaction) => {
    let booking = await Booking.findOne( { where: { qrCode } });
    //OPEN LOCKER FOR THE FIRST TIME
    if(booking.bookingStatusEnum === Constants.BookingStatus.Unfufilled) {
      //call open locker api
      
      booking = await booking.update({ bookingStatusEnum: Constants.BookingStatus.Active }, { transaction });

      let locker = await Locker.findOne( { where: { lockerTypeId: booking.lockerTypeId, lockerStatusEnum: Constants.LockerStatus.Empty } });
      locker = await locker.update( { lockerStatusEnum: Constants.LockerStatus.InUse }, { transaction }); 
      await assignLockersToBookings(booking.id, locker.id, transaction);
      
    //OPEN LOCKER FOR THE SECOND TIME
    } else if (booking.bookingStatusEnum === Constants.BookingStatus.Active) {
      let extraDuration = new Date() - booking.endTime;
      let extraPrice;
      let passHalfAnHourDuration = extraDuration - 1800000;
      let price = await LockerType.findByPk(locker.lockerTypeId).price;
      if (passHalfAnHourDuration > 0) {
        extraPrice = passHalfAnHourDuration * (price / 180000) * 2 + price;
      } else extraprice = extraDuration * (price / 180000)
      
      let creditPaymentRecord
      if(!Checker.isEmpty(booking.customerId)) {
         creditPaymentRecord = await CreditPaymentRecordService.payCreditCustomer(booking.customerId, extraPrice, transaction);
      } else creditPaymentRecord = await CreditPaymentRecordService.payCreditMerchant(booking.merchantId, extraPrice, transaction);

      booking = await booking.update({ bookingStatusEnum: Constants.BookingStatus.Fufilled, bookingPrice: booking.bookingPrice + extraPrice }, { transaction });
      let locker = await Locker.findByPk(booking.lockerId);
      locker = await locker.update( { lockerStatusEnum: Constants.LockerStatus.Empty }, { transaction }); 
      
      if(!Checker.isEmpty(booking.bookingPackageId)) {
        let bookingPackage = await BookingPackage.findByPk(booking.bookingPackageId);
        bookingPackage = await bookingPackage.update({ quota: ++bookingPackage.quota }, { transaction });
      }
    }
  }
    
};