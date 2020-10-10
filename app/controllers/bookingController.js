const { sendErrorResponse } = require('../common/error/errorHandler');
const sequelize = require('../common/database');
const BookingService = require('../services/bookingService');


module.exports = {
  createBookingByCustomer: async(req, res) => {
    try {
      const bookingData = req.body;
      let booking;
      await sequelize.transaction(async (transaction) => {
          booking = await BookingService.createBookingByCustomer(bookingData, transaction);
      });
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
      return res.status(200).send(booking);
    } catch (err) {
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
      let { customerId } = req.params;
      let bookings = await BookingService.retrieveBookingByCustomerId(customerId);  
      return res.status(200).send(bookings);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveBookingByMerchantId: async(req, res) => {
    try {
      let { merchantId } = req.params;
      let bookings = await BookingService.retrieveBookingByMerchantId(merchantId);  
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