const Checker = require('../common/checker');
const Constants = require('../common/constants');
const EmailHelper = require('../common/emailHelper');
const CustomError = require('../common/error/customError');
const NotificationHelper = require('../common/notificationHelper');
const Booking = require('../models/Booking');
const BookingPackage = require('../models/BookingPackage');
const Kiosk = require('../models/Kiosk');

const Locker = require('../models/Locker');
const LockerActionRecord = require('../models/LockerActionRecord');
const LockerType = require('../models/LockerType');
const Order = require('../models/Order');
const CreditPaymentRecordService = require('./creditPaymentRecordService');

const assignLockersToBookings = async(bookingId, lockerId, transaction) => {
  await Locker.update( { lockerStatusEnum: Constants.LockerStatus.IN_USE }, { where: { id: lockerId }, transaction });
  await Booking.update( { lockerId, bookingStatusEnum: Constants.BookingStatus.ACTIVE }, { where: {id: bookingId }, transaction });
};

module.exports = {
  createLocker: async(lockerData, transaction) => {
    const { lockerTypeId, kioskId, lockerCode } = lockerData;
    Checker.ifEmptyThrowError(lockerTypeId, 'Locker type ' + Constants.Error.IdRequired)
    Checker.ifEmptyThrowError(lockerCode, 'Locker code ' + Constants.Error.XXXIsRequired)
    Checker.ifEmptyThrowError(kioskId, 'Kiosk ' + Constants.Error.IdRequired)
    Checker.ifEmptyThrowError(await Kiosk.findByPk(kioskId), Constants.Error.KioskNotFound)
    console.log(lockerTypeId)
    Checker.ifEmptyThrowError(await LockerType.findByPk(lockerTypeId), Constants.Error.LockerTypeNotFound)
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

    return await locker.update({ lockerStatusEnum: Constants.LockerStatus.EMPTY }, { transaction });
  },

  setLockerInUse: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    const locker = await Locker.findByPk(id);
    Checker.ifEmptyThrowError(locker, Constants.Error.LockerNotFound);
    Checker.ifDeletedThrowError(locker, Constants.Error.LockerDeleted);

    return await locker.update({ lockerStatusEnum: Constants.LockerStatus.IN_USE }, { transaction });
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
    return await Locker.findAll({ where: { lockerStatusEnum: Constants.LockerStatus.EMPTY } });
  },

  retrieveAvailableLockersByLockerType: async(lockerTypeId) => {
    return await Locker.findAll({ where: { lockerTypeId, lockerStatusEnum: Constants.LockerStatus.EMPTY } });
  },

  scanOpenLocker: async(qrCode, transaction) => {
    let booking = await Booking.findOne( { where: { qrCode } });
    if(Checker.isEmpty(booking)) {
      throw new CustomError(Constants.Error.InvalidQrCode);
    }
    if(booking.bookingStatusEnum !== Constants.BookingStatus.UNFULFILLED && booking.bookingStatusEnum !== Constants.BookingStatus.ACTIVE) {
      console.log(booking.bookingStatusEnum)
      throw new CustomError(Constants.Error.InvalidQrCode);
    } 

    let text = '';

    console.log(booking.bookingStatusEnum)
    let locker;
    //OPEN LOCKER FOR THE FIRST TIME
    if(booking.bookingStatusEnum === Constants.BookingStatus.UNFULFILLED) {
   
      if(booking.startDate.getTime() > new Date(new Date().getTime() + 60000*5)) throw new CustomError(Constants.Error.BookingHasNotStarted)
      //call open locker api, create locker action record after integrating to hardware

      locker = await Locker.findOne( { where: { lockerTypeId: booking.lockerTypeId, lockerStatusEnum: Constants.LockerStatus.EMPTY } });
      let lockerAction = await LockerActionRecord.create({ lockerId: locker.id, lockerActionEnum: Constants.LockerAction.OPEN}) ;

      locker = await locker.update( { lockerStatusEnum: Constants.LockerStatus.IN_USE }, { transaction }); 
      await assignLockersToBookings(booking.id, locker.id, transaction);
      
      //QR CODE
      let qrCode = Math.random().toString(36).substring(2);
      while (!Checker.isEmpty(await Booking.findOne({ where: { qrCode } }))) {
        qrCode = Math.random().toString(36).substring(2);
      }
      if(!Checker.isEmpty(booking.orderId)) {
        let order = await Order.findByPk(booking.orderId);
        await order.update({ orderStatusEnum: Constants.OrderStatus.READY_FOR_COLLECTION}, { transaction });
        NotificationHelper.notificationOrderReadyForCollection(order.id, order.customerId)
      }
      booking = await booking.update({ bookingStatusEnum: Constants.BookingStatus.ACTIVE, qrCode }, { transaction });
    //OPEN LOCKER FOR THE SECOND TIME
    } else if (booking.bookingStatusEnum === Constants.BookingStatus.ACTIVE) {
      text = '. Your booking has ended.'
      let extraDuration = new Date() - booking.endTime;
      let extraPrice;
      let passHalfAnHourDuration = extraDuration - 1800000;
      locker = await Locker.findByPk(booking.lockerId)
      let price = await LockerType.findByPk(locker.lockerTypeId).pricePerHalfHour;
      if (passHalfAnHourDuration > 0) {
        extraPrice = passHalfAnHourDuration * (price / 180000) * 2 + price;
      } else extraprice = extraDuration * (price / 180000)
      
      if(!Checker.isEmpty(extraPrice)) {
        if(!Checker.isEmpty(booking.merchantId)) {
          extraPrice = extraPrice.toFixed(2);
          extraPrice = Number(extraPrice)
          console.log('extra' + extraPrice)
          creditPaymentRecord = await CreditPaymentRecordService.payCreditMerchant(booking.merchantId, extraPrice, Constants.CreditPaymentType.BOOKING_OVERTIME_CHARGE, transaction);
        } else {
          console.log('extra2' + extraPrice)
          creditPaymentRecord = await CreditPaymentRecordService.payCreditCustomer(booking.customerId, extraPrice, Constants.CreditPaymentType.BOOKING_OVERTIME_CHARGE, transaction);
        }
        booking = await booking.update({ bookingPrice: booking.bookingPrice + extraPrice }, { transaction });
      }

      console.log('hey')
      booking = await booking.update({ bookingStatusEnum: Constants.BookingStatus.FULFILLED }, { transaction });
      locker = await locker.update( { lockerStatusEnum: Constants.LockerStatus.EMPTY }, { transaction }); 
      
      if(!Checker.isEmpty(booking.bookingPackageId)) {
        let bookingPackage = await BookingPackage.findByPk(booking.bookingPackageId);
        bookingPackage = await bookingPackage.update({ lockerCount: --bookingPackage.lockerCount }, { transaction });
      }
    }
    return 'Locker Number: ' +  locker.lockerCode + text
  }
};