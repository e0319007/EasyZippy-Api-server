const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');
const Customer = require('../models/Customer');

const Order = require('../models/Order')

module.exports = {
  retrieveOrderByCustomerId: async(customerId) => {
    Checker.isEmpty(customerId, Constants.Error.IdRequired)
    Checker.isEmpty(await Customer.findByPk(customerId), Constants.Error.CustomerNotFound)
    return await Order;//CHNAGE
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