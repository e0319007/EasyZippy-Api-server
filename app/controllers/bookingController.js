const { sendErrorResponse } = require('../common/error/errorHandler');
const sequelize = require('../common/database');
const BookingService = require('../services/bookingService');
const ScheduleHelper = require('../common/scheduleHelper'); 
const NotificationHelper = require('../common/notificationHelper'); 

module.exports = {
  createBookingByCustomer: async(req, res) => {
    try {
      const bookingData = req.body;
      let booking;
      await sequelize.transaction(async (transaction) => {
          booking = await BookingService.createBookingByCustomer(bookingData, transaction);
      });
      let startDate = booking.startDate;
      let endDate = booking.endDate;
      ScheduleHelper.scheduleEvent(new Date(startDate.getTime() - 10 * 60 * 1000), NotificationHelper.notificationBookingStartingSoon)
      ScheduleHelper.scheduleEvent(startDate, NotificationHelper.notificationBookingStarted)
      ScheduleHelper.scheduleEvent(new Date(endDate.getTime() - 10 * 60 * 1000), NotificationHelper.notificationBookingReachingSoon)
      ScheduleHelper.scheduleEvent(endDate, NotificationHelper.notificationBookingReached)
      return res.status(200).send(booking);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },
  
  createBookingByMerchant: async(req, res) => {
    try {
      const bookingData = req.body;
      let booking;
      await sequelize.transaction(async (transaction) => {
          booking = await BookingService.createBookingByMerchant(bookingData, transaction);
      });
      let startDate = booking.startDate;
      let endDate = booking.endDate;
      ScheduleHelper.scheduleEvent(new Date(startDate.getTime() - 10 * 60 * 1000), NotificationHelper.notificationBookingStartingSoonMerchant)
      ScheduleHelper.scheduleEvent(startDate, NotificationHelper.notificationBookingStartedMerchant)
      ScheduleHelper.scheduleEvent(new Date(endDate.getTime() - 10 * 60 * 1000), NotificationHelper.notificationBookingReachingSoonMerchant)
      ScheduleHelper.scheduleEvent(endDate, NotificationHelper.notificationBookingReachedMerchant)
      return res.status(200).send(booking);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  createBookingWithBookingPackageByCustomer: async(req, res) => {
    try {
      const bookingData = req.body;
      let booking;
      await sequelize.transaction(async (transaction) => {
          booking = await BookingService.createBookingWithBookingPackageByCustomer(bookingData, transaction);
      });
      let startDate = booking.startDate;
      let endDate = booking.endDate;
      ScheduleHelper.scheduleEvent(new Date(startDate.getTime() - 10 * 60 * 1000), NotificationHelper.notificationBookingStartingSoon)
      ScheduleHelper.scheduleEvent(startDate, NotificationHelper.notificationBookingStarted)
      ScheduleHelper.scheduleEvent(new Date(endDate.getTime() - 10 * 60 * 1000), NotificationHelper.notificationBookingReachingSoon)
      ScheduleHelper.scheduleEvent(endDate, NotificationHelper.notificationBookingReached)
      return res.status(200).send(booking);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  createBookingWithBookingPackageByMerchant: async(req, res) => {
    try {
      const bookingData = req.body;
      let booking;
      await sequelize.transaction(async (transaction) => {
          booking = await BookingService.createBookingWithBookingPackageByMerchant(bookingData, transaction);
      });
      let startDate = booking.startDate;
      let endDate = booking.endDate;
      ScheduleHelper.scheduleEvent(new Date(startDate.getTime() - 10 * 60 * 1000), NotificationHelper.notificationBookingStartingSoonMerchant)
      ScheduleHelper.scheduleEvent(startDate, NotificationHelper.notificationBookingStartedMerchant)
      ScheduleHelper.scheduleEvent(new Date(endDate.getTime() - 10 * 60 * 1000), NotificationHelper.notificationBookingReachingSoonMerchant)
      ScheduleHelper.scheduleEvent(endDate, NotificationHelper.notificationBookingReachedMerchant)
      return res.status(200).send(booking);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  tagBookingToOrder: async(req, res) => {
    try{
      const { bookingId, orderId } = req.body;
      await sequelize.transaction(async (transaction) => {
        booking = await BookingService.tagBookingToOrder(bookingId, orderId, transaction);
      });
      res.status(200).send(booking);
    } catch(err) {
      sendErrorResponse(res, err);
    } 
  },

  addCollectorToBooking: async(req, res) => {
    try{
      const { bookingId, collectorId }= req.body;
      await sequelize.transaction(async (transaction) => {
        booking = await BookingService.addCollectorToBooking(bookingId, collectorId, transaction);
      });
      res.status(200).send(booking);
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  removeCollectorToBooking: async(req, res) => {
    try{
      const bookingId = req.body;
      await sequelize.transaction(async (transaction) => {
        booking = await BookingService.addCollectorToBooking(bookingId, transaction);
      });
      res.status(200).send(booking);
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  changeCollectorToBooking: async(req, res) => {
    try{
      const { bookingId, collectorId }= req.body;
      await sequelize.transaction(async (transaction) => {
        booking = await BookingService.changeCollectorToBooking(bookingId, collectorId, transaction);
      });
      res.status(200).send(booking);
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveBookingById: async(req, res) => {
    try {
      let { id } = req.params;
      let booking = await BookingService.retrieveBookingById(id);  
      return res.status(200).send(booking);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveBookingByCustomerId: async(req, res) => {
    try {
      let { id } = req.params;
      let bookings = await BookingService.retrieveBookingByCustomerId(id);  
      return res.status(200).send(bookings);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveBookingByCollectorId: async(req, res) => {
    try {
      let { collectorId } = req.params;
      let bookings = await BookingService.retrieveBookingByCollectorId(collectorId);  
      return res.status(200).send(bookings);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveBookingByMerchantId: async(req, res) => {
    try {
      let { id } = req.params;
      let bookings = await BookingService.retrieveBookingByMerchantId(id);  
      return res.status(200).send(bookings);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveBookingByOrderId: async(req, res) => {
    try {
      let { orderId } = req.params;
      let bookings = await BookingService.retrieveBookingByOrderId(orderId);  
      return res.status(200).send(bookings);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveAllBookingsByCustomer: async(req, res) => {
    try {
      let bookings = await BookingService.retrieveAllBookingsByCustomer();  
      return res.status(200).send(bookings);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveOngoingBookingsByCustomerId: async(req, res) => {
    try {
      let { id } = req.params;
      let bookings = await BookingService.retrieveOngoingBookingsByCustomerId(id);  
      return res.status(200).send(bookings);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveOngoingBookingsByMerchantId: async(req, res) => {
    try {
      let { id } = req.params;
      let bookings = await BookingService.retrieveOngoingBookingsByMerchantId(id);  
      return res.status(200).send(bookings);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveAllBookingsByMerchant: async(req, res) => {
    try {
      let bookings = await BookingService.retrieveAllBookingsByMerchant();  
      return res.status(200).send(bookings);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  cancelBooking: async(req, res) => {
    try {
      const { id } = req.params;
      await sequelize.transaction(async (transaction) => {
          booking = await BookingService.cancelBooking(id, transaction);
      });
      return res.status(200).send(booking);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },
}