const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');

const Booking = require('../models/Booking')
const Merchant = require('../models/Merchant');
const Customer = require('../models/Customer');
const BookingPackage = require('../models/BookingPackage');
const BookingPackageModel = require('../models/BookingPackageModel');
const LockerService = require('./lockerService');
const Locker = require('../models/Locker');
const LockerType = require('../models/LockerType');
const CreditPaymentRecordService = require('./creditPaymentRecordService');
const Order = require('../models/Order');
const Kiosk = require('../models/Kiosk');
const ScheduleHelper = require('../common/scheduleHelper')
const NotificationHelper = require('../common/notificationHelper');
const CreditPaymentRecord = require('../models/CreditPaymentRecord');
const EmailHelper = require('../common/emailHelper');

const addCollectorToBooking = async(id, collectorId, transaction) => {
  Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
  let booking = await Booking.findByPk(id);
  Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound);

  Checker.ifEmptyThrowError(collectorId, 'Collector ' + Constants.Error.IdRequired);
  let customer = await Customer.findByPk(collectorId);
  Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);
  
  booking = await booking.update({ collectorId }, { transaction });
  console.log('add collector to booking now is')
  console.log(booking);
  NotificationHelper.notificationCollectorAdded(id, collectorId);
  EmailHelper.sendEmailForAddCollector(customer.email, booking.id)
  return booking;
};

const removeCollectorToBooking = async(id, transaction) => {
  Checker.ifEmptyThrowError(id, Constants.Error.IdRequired)
  let booking = await Booking.findByPk(id);
  let collectorId = await booking.collectorId;
  Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound);
  
  let qrCode = Math.random().toString(36).substring(2);
  while (!Checker.isEmpty(await Booking.findOne({ where: { qrCode } }))) {
    qrCode = Math.random().toString(36).substring(2);
  }

  booking = await booking.update({ collectorId: null, qrCode }, { transaction });
  console.log('CHECK COLLECTOR TO BE REMOVED: ' + booking.collectorId)
  NotificationHelper.notificationCollectorRemoved(id, collectorId);
  EmailHelper.sendEmailForRemoveCollector((await Customer.findByPk(collectorId)).email, booking.id)
  return booking;
};

const changeCollectorToBooking = async(id, collectorId, transaction) => {
  Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
  let booking = await Booking.findByPk(id);
  Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound);
  const oldCollectorId = booking.collectorId;
  console.log('old booking')
  console.log(booking)

  Checker.ifEmptyThrowError(collectorId, 'Collector ' + Constants.Error.IdRequired);
  let customer = await Customer.findByPk(collectorId);
  Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);

  let qrCode = Math.random().toString(36).substring(2);
  while (!Checker.isEmpty(await Booking.findOne({ where: { qrCode } }))) {
    qrCode = Math.random().toString(36).substring(2);
  }
  
  booking = await booking.update({ collectorId: customer.id, qrCode }, { transaction });
  console.log('CHECK COLLECTOR TO BE REMOVED: ' + oldCollectorId)

  NotificationHelper.notificationCollectorAdded(id, collectorId);
  NotificationHelper.notificationCollectorRemoved(id, oldCollectorId);
  EmailHelper.sendEmailForAddCollector(customer.email, booking.id)
  EmailHelper.sendEmailForRemoveCollector((await Customer.findByPk(oldCollectorId)).email, booking.id)
  return booking;
};


const checkBookingAvailable = async(startDate, endDate, lockerTypeId, kioskId) => {
  let bookings = await Booking.findAll({ where: { lockerTypeId, kioskId } });
  let lockers = await Locker.findAll({ where: { lockerTypeId, kioskId } });

  let bookingPackageModels = await BookingPackageModel.findAll({ where: { lockerTypeId } });
  let bookingPackageCount = 0;

  for(const bpm of bookingPackageModels) {
    //let bookingPackage = await BookingPackage.findAll({ where: { bookingPackageModelId: bpm.id } });
    let bookingPackages = await bpm.getBookingPackages();
    let availBookingPackage = new Array();
    //check for non-expired booking packages only
  
    for(let bp of bookingPackages) {
      if(bp.kioskId === kioskId && !(bp.endDate < startDate || bp.startDate > endDate)) availBookingPackage.push(bp);
    }
    bookingPackageCount += availBookingPackage.length * bpm.quota;
  }

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
  //console.log(emptyTimes)
  let availableSlots = new Array();
  let i = 0;
  let j = 0;
  while(i < emptyTimes.length) {
    let availableStartDate;
    let availableEndDate;
    let duration = 0;
    j = i;
    while(emptyTimes[j] < availLockersOfType) {
      availableStartDate = new Date(startDate.getTime() + i * 60000)
      duration++; 
      j++;
    }
    if(availableStartDate != null && duration >= 15) {
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
  let pricePerMinute = (await LockerType.findByPk(lockerTypeId)).pricePerHalfHour / 30;
  pricePerMinute = pricePerMinute.toFixed(2);
  let duration = endDate - startDate - 1800000;
  if(duration < 0) {
    return 0;
  }
  return Number((duration / 1000 / 60) * Number(pricePerMinute));
}

const createBookingWithBookingPackageByCustomer = async(bookingData, transaction) => {
  let { startDate, endDate, bookingSourceEnum, customerId, bookingPackageId} = bookingData;
  let booking;
  startDate = new Date(startDate);
  endDate = new Date(endDate);
  if(startDate.getTime() + 300000 < (new Date()).getTime()) throw new CustomError(Constants.Error.InvalidDate)
  if(startDate > endDate) throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
  if(endDate.getTime() - startDate.getTime() > 24 * 60 * 60 * 1000) throw new CustomError(Constants.Error.TimeCannotExceed24H);
  Checker.ifEmptyThrowError(customerId, 'Customer ' + Constants.Error.IdRequired);
  Checker.ifEmptyThrowError(await Customer.findByPk(customerId), Constants.Error.CustomerNotFound);
  Checker.ifEmptyThrowError(bookingSourceEnum, 'Booking Source ' + Constants.Error.XXXIsRequired);
  
  Checker.ifEmptyThrowError(bookingPackageId, 'Booking package ' + Constants.Error.IdRequired);
  //Check if booking package belongs to the customer
  let bookingPackage = await BookingPackage.findOne({ where: { id: bookingPackageId, expired: false, customerId } });
  Checker.ifEmptyThrowError(bookingPackage, Constants.Error.BookingPackageNotFound);
  let bookingPackageModel = await BookingPackageModel.findByPk(bookingPackage.bookingPackageModelId);
  //Check if at least the start date of a booking falls within the booking package period
  if(startDate > bookingPackage.endDate) throw new CustomError(Constants.Error.BookingStartDateAfterPackageEndDate);
  //Check booking package availability
  if(bookingPackage.lockerCount >= bookingPackageModel.quota) {
    throw new CustomError(Constants.Error.BookingPackageReachedMaximumLockerCount);
  }

  //QR CODE
  let qrCode = Math.random().toString(36).substring(2);
  while (!Checker.isEmpty(await Booking.findOne({ where: { qrCode } }))) {
    qrCode = Math.random().toString(36).substring(2);
  }

  let lockerTypeId = bookingPackageModel.lockerTypeId;
  let kioskId = bookingPackage.kioskId;

  /*CHECK BOOKING CROSS OVER BOOKING PACKAGE END TIME*/
  if(endDate > bookingPackage.endDate) {
    console.log('PASS')
    let bookingPrice = await calculatePrice(bookingPackage.endDate, endDate, lockerTypeId);
    let availSlots = await checkBookingAvailable(bookingPackage.endDate, endDate, lockerTypeId, kioskId);
    if (Checker.isEmpty(availSlots) || (!Checker.isEmpty(availSlots) && availSlots[0].startDate.getTime() != bookingPackage.endDate.getTime() || availSlots[0].endDate.getTime() != endDate.getTime())) {
      throw new CustomError(Constants.Error.BookingCannotBeMade);
    }
    //CREDIT PAYMENT
    let creditPaymentRecord = await CreditPaymentRecordService.payCreditCustomer(customerId, bookingPrice, transaction);
    let creditPaymentRecordId = creditPaymentRecord.id;

    //BOOKING PACKAGE UPDATE
    await BookingPackage.update({ lockerCount: ++bookingPackage.lockerCount }, { where: { id: bookingPackageId }, transaction });

    let booking = await Booking.create({ startDate, endDate, bookingSourceEnum, customerId, qrCode, bookingPackageId, lockerTypeId, kioskId, bookingPrice, creditPaymentRecordId }, { transaction });
    return booking;
  
  } else {

    //BOOKING PACKAGE UPDATE
    await BookingPackage.update({ lockerCount: ++bookingPackage.lockerCount }, { where: { id: bookingPackageId }, transaction });

    let kioskId = bookingPackage.kioskId;

    booking = await Booking.create({ startDate, endDate, bookingSourceEnum, customerId, qrCode, bookingPackageId, lockerTypeId, kioskId }, { transaction });

    return booking;
  }
}

module.exports = {
  // should qr code be generated on the front end?
  // backend store a randomly generated string, 
  // front end retrieve the string and make it into a qr code,
  // after scan, map back to the string and send to backend to open locker,

  checkBookingAllowed: async(bookingData) => {
    let { startDate, endDate, lockerTypeId, kioskId, bookingPackageId } = bookingData;
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    if (Checker.isEmpty(bookingPackageId)) {
      let availSlots = await checkBookingAvailable(startDate, endDate, lockerTypeId, kioskId);
      if(Checker.isEmpty(availSlots)) {
        return false;
      } else if (availSlots[0].startDate.getTime() != startDate.getTime() || availSlots[0].endDate.getTime() != endDate.getTime()) {
        return availSlots;
      } else return true;
    } else {
      let bookingPackage = await BookingPackage.findByPk(bookingPackageId);
      Checker.ifEmptyThrowError(bookingPackage, Constants.Error.BookingPackageNotFound);
      if(endDate > bookingPackage.endDate) {
        let availSlots = await checkBookingAvailable(bookingPackage.endDate, endDate, lockerTypeId, kioskId);
        if (Checker.isEmpty(availSlots) || (!Checker.isEmpty(availSlots) && availSlots[0].startDate.getTime() !== bookingPackage.endDate.getTime() || availSlots[0].endDate.getTime() !== endDate.getTime())) {
          availSlots.push({
            'startDate': startDate,
            'endDate': bookingPackage.endDate
          })
          return availSlots;
        } else return true
      } else return true;
    }
    
  },

  createBookingByCustomer: async(bookingData, transaction) => {
    let { startDate, endDate, bookingSourceEnum, customerId, lockerTypeId, kioskId } = bookingData;
    
    const customer = await Customer.findByPk(customerId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);
    for(const bookingPackage of await customer.getBookingPackages()) {
      const bookingPackageModel = await bookingPackage.getBookingPackageModel();
      const bookingPackageModelLockerType = await bookingPackageModel.getLockerType();
      if(startDate <= bookingPackage.endDate && !bookingPackage.expired && bookingPackageModelLockerType.id === lockerTypeId && bookingPackage.lockerCount < bookingPackageModel.quota) {
        return await createBookingWithBookingPackageByCustomer({ ...bookingData, bookingPackageId: bookingPackage.id }, transaction);
      }
    }
    
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    if(startDate.getTime() + 300000 < (new Date()).getTime()) throw new CustomError(Constants.Error.InvalidDate)
    if(startDate.getTime() > endDate.getTime()) throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    if(endDate.getTime() - startDate.getTime() > 24 * 60 * 60 * 1000) throw new CustomError(Constants.Error.TimeCannotExceed24H);
    Checker.ifEmptyThrowError(customerId, 'Customer ' + Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(await Customer.findByPk(customerId), Constants.Error.CustomerNotFound);
    Checker.ifEmptyThrowError(bookingSourceEnum, 'Booking Source ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(kioskId, 'Kiosk ' + Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(await Kiosk.findByPk(kioskId), 'Kiosk ' + Constants.Error.KioskNotFound);

    let bookingPrice = await calculatePrice(startDate, endDate, lockerTypeId);
    let availSlots = await checkBookingAvailable(startDate, endDate, lockerTypeId, kioskId);
    if(Checker.isEmpty(availSlots) || availSlots[0].startDate.getTime() != startDate.getTime() || availSlots[0].endDate.getTime() != endDate.getTime()) {
      throw new CustomError(Constants.Error.BookingCannotBeMade);
    }

    bookingPrice = Number(bookingPrice.toFixed(2));

    //QR CODE
    let qrCode = Math.random().toString(36).substring(2);
    while (!Checker.isEmpty(await Booking.findOne({ where: { qrCode } }))) {
      qrCode = Math.random().toString(36).substring(2);
    }
    
    //CREDIT PAYMENT
    let creditPaymentRecord = await CreditPaymentRecordService.payCreditCustomer(customerId, bookingPrice, Constants.CreditPaymentType.BOOKING, transaction);
    let creditPaymentRecordId = creditPaymentRecord.id;

    let booking = await Booking.create({ startDate, endDate, bookingSourceEnum, customerId, qrCode, lockerTypeId, kioskId, bookingPrice, creditPaymentRecordId }, { transaction })
    return booking;
  },
  
  createBookingByMerchant: async(bookingData, transaction) => {
    let { startDate, endDate, bookingSourceEnum, merchantId, lockerTypeId, kioskId} = bookingData;
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    console.log(startDate)
    console.log(endDate)
    if(startDate.getTime() + 300000 < (new Date()).getTime()) throw new CustomError(Constants.Error.InvalidDate)
    if(startDate > endDate) throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    if(endDate.getTime() - startDate.getTime() > 2 * 24 * 60 * 60 * 1000) throw new CustomError(Constants.Error.TimeCannotExceed48H);
    Checker.ifEmptyThrowError(merchantId, 'Merchant ' + Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(await Merchant.findByPk(merchantId), Constants.Error.MerchantNotFound);
    Checker.ifEmptyThrowError(bookingSourceEnum, 'Booking Source ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(kioskId, 'Kiosk ' + Constants.Error.IdRequired);
    Checker.ifEmptyThrowError((await Kiosk.findByPk(kioskId)), Constants.Error.KioskNotFound);

    let bookingPrice = await calculatePrice(startDate, endDate, lockerTypeId);
    let availSlots = await checkBookingAvailable(startDate, endDate, lockerTypeId, kioskId);
    if(Checker.isEmpty(availSlots) || availSlots[0].startDate.getTime() != startDate.getTime() || availSlots[0].endDate.getTime() != endDate.getTime()) {
      throw new CustomError(Constants.Error.BookingCannotBeMade);
    }

    //QR CODE
    let qrCode = Math.random().toString(36).substring(2);
    while (!Checker.isEmpty(await Booking.findOne({ where: { qrCode } }))) {
      qrCode = Math.random().toString(36).substring(2);
    }

    //CREDIT PAYMENT
    let creditPaymentRecord = await CreditPaymentRecordService.payCreditMerchant(merchantId, bookingPrice, Constants.CreditPaymentType.BOOKING, transaction);
    let creditPaymentRecordId = creditPaymentRecord.id;

    let booking = await Booking.create({ startDate, endDate, bookingSourceEnum, merchantId, qrCode, lockerTypeId, kioskId, bookingPrice, creditPaymentRecordId }, { transaction });
    return booking;
  },


  createBookingWithBookingPackageByCustomer,


  createBookingWithBookingPackageByMerchant: async(bookingData, transaction) => {
    let { startDate, endDate, bookingSourceEnum, merchantId, bookingPackageId} = bookingData;
    let booking;
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    console.log(startDate)
    console.log(endDate)
    if(startDate.getTime() + 300000 < (new Date()).getTime()) throw new CustomError(Constants.Error.InvalidDate)
    if(startDate > endDate) throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    if(endDate.getTime() - startDate.getTime() > 2 * 24 * 60 * 60 * 1000) throw new CustomError(Constants.Error.TimeCannotExceed48H);
    Checker.ifEmptyThrowError(merchantId, 'Merchant ' + Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(await Merchant.findByPk(merchantId), Constants.Error.MerchantNotFound);
    Checker.ifEmptyThrowError(bookingSourceEnum, 'Booking Source ' + Constants.Error.XXXIsRequired);

    Checker.ifEmptyThrowError(bookingPackageId, 'Booking package ' + Constants.Error.IdRequired);
    //Check if booking package belongs to the merchant
    let bookingPackage = await BookingPackage.findOne({ where: { id: bookingPackageId, expired: false, merchantId } });
    Checker.ifEmptyThrowError(bookingPackage, Constants.Error.BookingPackageNotFound);
    let bookingPackageModel = await BookingPackageModel.findByPk(bookingPackage.bookingPackageModelId);
    //Check if at least the start date of a booking falls within the booking package period
    if(startDate > bookingPackage.endDate) throw new CustomError(Constants.Error.BookingStartDateAfterPackageEndDate);
    //Check booking package availability
    if(bookingPackage.lockerCount >= bookingPackageModel.quota) {
      throw new CustomError(Constants.Error.BookingPackageReachedMaximumLockerCount);
    }

    //QRCODE
    let qrCode = Math.random().toString(36).substring(2);
    while (!Checker.isEmpty(await Booking.findOne({ where: { qrCode } }))) {
      qrCode = Math.random().toString(36).substring(2);
    }    
    
    let lockerTypeId = bookingPackageModel.lockerTypeId;
    let kioskId = bookingPackage.kioskId;

    /*CHECK BOOKING CROSS OVER BOOKING PACKAGE END TIME*/
    if(endDate > bookingPackage.endDate) {
      let bookingPrice = await calculatePrice(bookingPackage.endDate, endDate, lockerTypeId);
      let availSlots = await checkBookingAvailable(bookingPackage.endDate, endDate, lockerTypeId, kioskId);
      if (Checker.isEmpty(availSlots) || (!Checker.isEmpty(availSlots) && availSlots[0].startDate.getTime() != bookingPackage.endDate.getTime() || availSlots[0].endDate.getTime() != endDate.getTime())) {
        throw new CustomError(Constants.Error.BookingCannotBeMade);
      }

      //CREDIT PAYMENT
      let creditPaymentRecord = await CreditPaymentRecordService.payCreditMerchant(merchantId, bookingPrice, transaction);
      let creditPaymentRecordId = creditPaymentRecord.id;

      //BOOKING PACKAGE UPDATE
      await BookingPackage.update({ lockerCount: ++bookingPackage.lockerCount }, { where: { id: bookingPackageId }, transaction });

      let booking = await Booking.create({ startDate, endDate, bookingSourceEnum, merchantId, qrCode, bookingPackageId, lockerTypeId, kioskId, bookingPrice, creditPaymentRecordId }, { transaction });
      return booking;
    
    } else {

      //BOOKING PACKAGE UPDATE
      await BookingPackage.update({ lockerCount: ++bookingPackage.lockerCount }, { where: { id: bookingPackageId }, transaction });

      let kioskId = bookingPackage.kioskId;

      booking = await Booking.create({ startDate, endDate, bookingSourceEnum, merchantId, qrCode, bookingPackageId, lockerTypeId, kioskId }, { transaction });

      return booking;
    }
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
    await addCollectorToBooking(id, order.customerId, transaction)
    return booking;
  },

  removeBookingFromOrder: async(id,  transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired)
    let booking = await Booking.findByPk(id);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound);
    let orderId = null;
    booking = await booking.update({ orderId }, { transaction });
    await removeCollectorToBooking(id, transaction)
    return booking;
  },

  //add in a collector 
  

  retrieveAllBookingsByCustomer: async() => {
    const bookings = await Booking.findAll();
    let customerBookings = new Array();
    for(let b of bookings) {
      if(b.merchantId === null) {
        customerBookings.push(b);
      }
    }
    return customerBookings;
  },

  retrieveAllBookingsByMerchant: async() => {
    const bookings = await Booking.findAll();
    let merchantBookings = new Array();
    for(let b of bookings) {
      if(b.merchantId !== null) {
        merchantBookings.push(b);
      }
    }
    return merchantBookings;
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

  retrieveUpcomingBookingsByCustomerId: async(customerId) => {
    return await Booking.findAll({ where: { customerId, bookingStatusEnum: Constants.BookingStatus.UNFULFILLED }});
  },

  retrieveOngoingBookingsByCustomerId: async(customerId) => {
    return await Booking.findAll({ where: { customerId, bookingStatusEnum: Constants.BookingStatus.ACTIVE }});
    
  },

  retrieveUpcomingBookingsByMerchantId: async(merchantId) => {
    return await Booking.findAll({ where: { merchantId, bookingStatusEnum: Constants.BookingStatus.UNFULFILLED }});
  },

  retrieveOngoingBookingsByMerchantId: async(merchantId) => {
    return await Booking.findAll({ where: { merchantId, bookingStatusEnum: Constants.BookingStatus.ACTIVE }});
  },

  cancelBooking: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired)
    let booking = await Booking.findByPk(id);
    Checker.ifEmptyThrowError(booking, Constants.Error.BookingNotFound);
    
    if(booking.bookingStatusEnum != Constants.BookingStatus.UNFULFILLED || booking.startDate.getTime() - 30 * 60000 <= new Date().getTime()) {
      console.log(booking.startDate)
      console.log(booking.startDate.getTime())
      console.log(new Date(new Date() - 30 * 60000))
      console.log(new Date(new Date() - 30 * 60000).getTime())
      throw new CustomError(Constants.Error.BookingCannotBeCancelled)
    }

    const customer = await booking.getCustomer();
    const merchant = await booking.getMerchant();
    const creditPaymentRecord = await CreditPaymentRecord.findByPk(booking.creditPaymentRecordId);
    
    if(!Checker.isEmpty(customer) && booking.bookingPrice !== null && booking.bookingPrice !== 0) {
      console.log('creditPaymentRecord.referralCreditUsed' + creditPaymentRecord.referralCreditUsed)
      if(creditPaymentRecord.referralCreditUsed == 0) await CreditPaymentRecordService.refundCreditCustomer(customer.id, booking.bookingPrice, Constants.CreditPaymentType.BOOKING, transaction);
      else await CreditPaymentRecordService.refundCreditCustomerWithReferral(customer.id, booking.bookingPrice, Constants.CreditPaymentType.BOOKING, creditPaymentRecord.referralCreditUsed, transaction);
    }

    if(!Checker.isEmpty(merchant) && booking.bookingPrice !== null && booking.bookingPrice !== 0) {
      await CreditPaymentRecordService.increaseCreditMerchant(merchant.id, booking.bookingPrice, Constants.CreditPaymentType.REFUND, transaction);
    }

    if(booking.bookingPackageId !== null) {
      let bookingPackage = await BookingPackage.findByPk(booking.bookingPackageId);
      await bookingPackage.update({lockerCount: --bookingPackage.lockerCount });
    }

    booking = await Booking.update({ 
    bookingStatusEnum: Constants.BookingStatus.CANCELLED 
    }, { where: { id }, transaction });
    return booking;
  },

  addCollectorToBooking, removeCollectorToBooking, changeCollectorToBooking

}

