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
      let cart;
      await sequelize.transaction(async (transaction) => {
        cart = await CartService.saveItemsToCart(customerId, cartData, transaction);
      });
      return res.status(200).send(cart);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveCartByCustomerId: async(req, res) => {
    try {
      const { customerId } = req.params;

      let cart;

      await sequelize.transaction(async (transaction) => {
        cart = await CartService.retrieveCartByCustomerId(customerId, transaction);
      });
      return res.status(200).send(cart);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  addToCart: async(req, res) => {
    try {
      const { customerId } = req.params;
      const lineItem = req.body.lineItem;
      await sequelize.transaction(async (transaction) => {
        await CartService.addToCart(customerId, lineItem, transaction);
      });
      return res.status(200).send();
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },
}