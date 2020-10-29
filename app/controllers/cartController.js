const sequelize = require('../common/database');
const { sendErrorResponse } = require('../common/error/errorHandler');

const CartService = require('../services/cartService')

module.exports = {
  getInvalidCartItems: async(req, res) => {
    try {
      const { lineItems } = req.body;

      const invalidLineItems = await CartService.getInvalidCartItems(lineItems);
      return res.status(200).send(invalidLineItems);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  saveItemsToCart: async(req, res) => {
    try {
      const { customerId } = req.params;
      const cartData = req.body;
      let returnValue;
      await sequelize.transaction(async (transaction) => {
        returnValue = await CartService.saveItemsToCart(customerId, cartData, transaction);
      });
      if(Array.isArray(returnValue)) {
        return res.status(400).send(returnValue);
      }
      return res.status(200).send(returnValue);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveCartByCustomerId: async(req, res) => {
    try {
      const { customerId } = req.params;

      const cart = await CartService.retrieveCartByCustomerId(customerId);
      return res.status(200).send(cart);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  }
}