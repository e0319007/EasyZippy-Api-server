const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');

const Order = require('../models/Order')

module.exports = {
  retrieveOrderByCustomerId: async(customerId) => {
    Checker.isEmpty(customerId, Constants.Error)
    return
  },

  retrieveOrderByMerchantId: async(merchantId) => {
  },

  retrieveAllOrders: async() => {
  },

  retrieveOrderById: async(id) => {
  },

  updateOrderStatus: async(orderStatus, transaction) => {
  },

  createOrder: async(orderData, transaction) => {
  },
}