const Checker = require('../common/checker');
const Constants = require('../common/constants');
const Customer = require('../models/Customer')
const Cart = require('../models/Cart');
const LineItem = require('../models/LineItem');

module.exports = {
  saveItemsToCart: async(id, cartData, transaction) => { 
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let customer = await Customer.findByPk(id);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);
    let cart = await Cart.findOne({ 
      where: {
        customerId: id
      }
    });
    while (!Checker.isEmpty(cart.lineItemId)) {
      LineItem.destroy(cart.lineItemId.pop());
    }
    return await cart.update(cartData, { transaction, returning: true });   
  },

  retrieveCartByCustomerId: async(id) => { 
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let customer = await Customer.findByPk(id);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);
    
    let cart = await Cart.findOne({ 
      where: {
        customerId: id
      }
    });
    return cart;
  }
}