const { sendErrorResponse } = require('../common/error/errorHandler');
const sequelize = require('../common/database');
const OrderService = require('../services/orderService');

module.exports = {
  retrieveOrderByCustomerId: async(req, res) => {
    try {
      let { customerId } = req.params
      return res.status(200).send(await OrderService.retrieveOrderByCustomerId(customerId));
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveOrderByMerchantId: async(req, res) => {
    try {
      let { merchantId } = req.params
      return res.status(200).send(await OrderService.retrieveOrderByMerchantId(merchantId));
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveAllOrders: async(req, res) => {
    try {
      return res.status(200).send(await OrderService.retrieveAllOrders());
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveOrderById: async(req, res) => {
    try {
      let { id } = req.params
      return res.status(200).send(await OrderService.retrieveOrderByMerchantId(id));
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveAllOrderStatus: async(req, res) => {
    try {
      const orderStatus = await OrderService.retrieveAllOrderStatus();
      return res.status(200).send(orderStatus);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  updateOrderStatus: async(req, res) => {
    try {
      let order;
      let { id } = req.params;
      let { orderStatus } = req.body;
      await sequelize.transaction(async (transaction) => {
        order = await OrderService.updateBookingStatus(id, orderStatus, transaction);
      });
      return res.status(200).send(order);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  createOrder: async(req, res) => {
    try {
      let createOrderReturnValue;
      let orderData = req.body;
      await sequelize.transaction(async (transaction) => {
        createOrderReturnValue = await OrderService.createOrder(orderData, transaction);
      });
      if(Array.isArray(createOrderReturnValue)) {
        return res.status(200).send(createOrderReturnValue);
      }
      return res.status(400).send(createOrderReturnValue.invalidCartItems);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },
}
