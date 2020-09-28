const sequelize = require('../common/database');
const { sendErrorResponse } = require('../common/error/errorHandler');

module.exports = {
  saveItemsToCart: async(req, res) => {
    try {
      const { customerId } = req.params;
      let cart;
      await sequelize.transaction(async (transaction) => {
        cart = await KioskService.updateKiosk(customerId, cartData, transaction);
    });
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
    return res.status(200).send(cart);
  },

  retrieveCartByCustomerId: async(req, res) => {
    try {
      const { customerId } = req.params;
      let cart;
      await sequelize.transaction(async (transaction) => {
        cart = await KioskService.updateKiosk(customerId, transaction);
    });
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
    return res.status(200).send(cart);
  },
}