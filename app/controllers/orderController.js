const { sendErrorResponse } = require('../common/error/errorHandler');
const sequelize = require('../common/database');
const BookingService = require('../services/bookingService');

module.exports = {
  retrieveOrderByCustomerId: async(req, res) => {
    try {
      
      return res.status(200).send(orders);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveOrderByMerchantId: async(req, res) => {
    try {
      
      return res.status(200).send(orders);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveAllOrders: async(req, res) => {
    try {
      
      return res.status(200).send(orders);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveOrderById: async(req, res) => {
    try {
      
      return res.status(200).send(orders);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  updateOrderStatus: async(req, res) => {
    try {
      let order;
      let orderStatusEnum = req.body.orderStatus;
      await sequelize.transaction(async (transaction) => {
        order = await BookingService.updateBookingStatus(orderStatusEnum, transaction);
      });
      return res.status(200).send(order);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  createOrder: async(req, res) => {
    try {
      let order;
      let orderData = req.body;
      await sequelize.transaction(async (transaction) => {
        order = await BookingService.createOrder(orderData, transaction);
      });
      return res.status(200).send(order);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },
}
