const Checker = require('../common/checker');
const Constants = require('../common/constants');
const Customer = require('../models/Customer')
const Cart = require('../models/Cart');
const LineItem = require('../models/LineItem');
const Product = require('../models/Product');
const ProductVariation = require('../models/ProductVariation');

module.exports = {
  saveItemsToCart: async(id, cartData, transaction) => { 
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let { lineItems } = cartData;
    let customer = await Customer.findByPk(id);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);
    let cart = await Cart.findOne({ 
      where: {
        customerId: id
      }
    });
    // console.log('****is array? ' + Array.isArray(await cart.getLineItems()))
    // console.log('****array? ' + await cart.getLineItems())
    while (!Checker.isEmpty(await cart.getLineItems())) {
      await LineItem.destroy((await cart.getLineItems()).pop(),  { transaction });
    }
    // console.log('lineItems')
    // console.log(lineItems)
    while(!Checker.isEmpty(lineItems)) {
      let lt = lineItems.pop();
      // console.log(lt);
      // console.log('in loop')
      await LineItem.create({ productId: lt.productId, productVariationId: lt.productVariationId, quantity: lt.quantity, cartId: id }, { transaction })
    }
    return await Cart.findByPk(cart.id);
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
    let temp = new Array();
    if (Checker.isEmpty(await cart.getLineItems())) return temp;
    // console.log('****is array? ' + Array.isArray(await cart.getLineItems()))

    // console.log(await cart.getLineItems())
    // console.log(typeof (await cart.getLineItems()))
    // console.log(typeof (await cart.getLineItems()))
    for(let li of (await cart.getLineItems())) {
      let p;
      let pv; 
      if(!Checker.isEmpty(li.productId)) p = await Product.findByPk(li.productId);
      else pv = await ProductVariation.findByPk(li.productVariationId);
      if ((!Checker.isEmpty(p) && !p.disabled && !p.deleted) || (!Checker.isEmpty(pv) && !pv.disabled && !pv.productDisabled && !pv.deleted)) {
        temp.push({
          product: p,
          productVariation: pv,
          quantity: li.quantity
        });
      }
    }
    return temp;
  }
}