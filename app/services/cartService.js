const Checker = require('../common/checker');
const Constants = require('../common/constants');
const { findAll } = require('../models/Customer');
const Customer = require('../models/Customer')
const Cart = require('../models/Cart')

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
    return await cart.update(cartData, { transaction, returning: true });   
  },

  retrieveCartByCustomerId: async(id) => { 
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let customer = await Customer.findByPk(id);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);
    
    let cart = await Cart.findAll({ 
      where: {
        customerId: id
      }
    });
    return cart;
  }
}