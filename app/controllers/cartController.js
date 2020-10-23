const sequelize = require('../common/database');
const { sendErrorResponse } = require('../common/error/errorHandler');

const CartService = require('../services/cartService')

module.exports = {
  saveItemsToCart: async(req, res) => {
    try {
      const { customerId } = req.params;
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

      cart = await CartService.retrieveCartByCustomerId(customerId);
      return res.status(200).send(cart);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },
}