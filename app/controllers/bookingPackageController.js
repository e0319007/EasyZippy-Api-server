const { sendErrorResponse } = require('../common/error/errorHandler');
const sequelize = require('../common/database');

const BookingPackageService = require('../services/bookingPackageService');

module.exports = {
  buyBookingPackageForCustomer: async(req, res) => {
    try { 
      const bookingPackageData = req.body;
      let bookingPackage;
      await sequelize.transaction(async (transaction) => {
        bookingPackage = await BookingPackageService.createBookingPackageForCustomer(bookingPackageData, transaction)
      });
      return res.status(200).send(bookingPackage);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  buyBookingPackageForMerchant: async(req, res) => {
    try { 
      const bookingPackageData = req.body;
      let bookingPackage;
      await sequelize.transaction(async (transaction) => {
        bookingPackage = await BookingPackageService.createBookingPackageForMerchant(bookingPackageData, transaction);
      });
      return res.status(200).send(bookingPackage);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },  

  retrieveAllBookingPackageByCustomerId: async(req, res) => {
    try { 
      const { customerId } = req.params;
      let bookingPackage = await BookingPackageService.retrieveAllBookingPackageByCustomerId(customerId);
      
      return res.status(200).send(bookingPackage);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },  

  retrieveCurrentBookingPackageByCustomerId: async(req, res) => {
    try { 
      const { customerId } = req.params;
      let bookingPackage = await BookingPackageService.retrieveCurrentBookingPackageByCustomerId(customerId);
      
      return res.status(200).send(bookingPackage);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },  

  retrieveAllBookingPackageByMerchantId: async(req, res) => {
    try { 
      const { merchantId } = req.params;
      let bookingPackage = await BookingPackageService.retrieveAllBookingPackageByMerchantId(merchantId);
      
      return res.status(200).send(bookingPackage);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },  

  retrieveCurrentBookingPackageByMerchantId: async(req, res) => {
    try { 
      const { merchantId } = req.params;
      let bookingPackage = await BookingPackageService.retrieveCurrentBookingPackageByMerchantId(merchantId);
      
      return res.status(200).send(bookingPackage);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  }, 

  retrieveBookingPackageByBookingPackageId: async(req, res) => {
    try { 
      const { id } = req.params;
      let bookingPackage = await BookingPackageService.retrieveBookingPackageByBookingPackageId(id);
      
      return res.status(200).send(bookingPackage);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveValidBookingPackageByCustomerIdAndLockerTypeId: async(req, res) => {
    try {
      const { customerId, lockerTypeId, bookingStartDate } = req.body;
      let bookingPackage = await BookingPackageService.retrieveValidBookingPackageByCustomerIdAndLockerTypeId(customerId, lockerTypeId, bookingStartDate);

      return res.status(200).send(bookingPackage);
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  }
}