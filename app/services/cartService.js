const Checker = require('../common/checker');
const Constants = require('../common/constants');
const Customer = require('../models/Customer')
const Cart = require('../models/Cart');
const LineItem = require('../models/LineItem');
const Product = require('../models/Product');
const ProductVariation = require('../models/ProductVariation');
const CustomError = require('../common/error/customError');
const Merchant = require('../models/Merchant');

const getInvalidCartItems = async(lineItems) => {
  const invalidCartItems = new Array();

  for(const lineItem of lineItems) {
    const productId = lineItem.productId;
    const productVariationId = lineItem.productVariationId
    const quantity = lineItem.quantity;

    if(Checker.isEmpty(productId) && Checker.isEmpty(productVariationId)) {
      throw new CustomError(Constants.Error.ProductIdOrProductVariationIdRequired);
    }

    if(!Checker.isEmpty(productId)) {
      const product = await Product.findByPk(lineItem.productId);
      Checker.ifEmptyThrowError(product, Constants.Error.ProductNotFound);
      if(product.deleted || product.disabled || product.quantityAvailable === 0) {
        invalidCartItems.push({ product });
      } else if(product.quantityAvailable < quantity) {
        invalidCartItems.push({ product: { ...product, quantityNotZero: true } });
      }
    } else {
      const productVariation = await ProductVariation.findByPk(lineItem.productVariationId);
      Checker.ifEmptyThrowError(productVariation, Constants.Error.ProductVariationNotFound);
      if(productVariation.deleted || productVariation.disabled || productVariation.quantityAvailable === 0) {
        invalidCartItems.push({ productVariation });
      } else if(productVariation.quantityAvailable < quantity) {
        invalidCartItems.push({ productVariation: { ...productVariation, quantityNotZero: true } });
      }
    }
  }

  return invalidCartItems;
};

module.exports = {
  getInvalidCartItems,

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

    let ctx = (await cart.getLineItems()).length;
    let i = 0;
    let liId = new Array();
    while (i < ctx) {
      const lt = (await cart.getLineItems({ transaction }))[0];
      liId.push(lt.id);
      await cart.removeLineItem(lt, { transaction });
      i++;
    }

    while(!Checker.isEmpty(liId)) {
      await LineItem.destroy({ where: { id: liId.pop() }, transaction });
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
    let cartItems = new Array();
    if (Checker.isEmpty(await cart.getLineItems())) return cartItems;
    // console.log('****is array? ' + Array.isArray(await cart.getLineItems()))

    // console.log(await cart.getLineItems())
    // console.log(typeof (await cart.getLineItems()))
    // console.log(typeof (await cart.getLineItems()))

    let merchantMapLineitems = new Map();

    for(let li of (await cart.getLineItems())) {
      let p;
      let pv; 
      let merchant;
      if(!Checker.isEmpty(li.productId)) p = await Product.findByPk(li.productId);
      else pv = await ProductVariation.findByPk(li.productVariationId);
      lineItem = {
          product: p,
          productVariation: pv,
          quantity: li.quantity
      };

      if(Checker.isEmpty(p)) {
        merchant = await Merchant.findByPk((await Product.findByPk(pv.productId)).merchantId);
      } else merchant = await Merchant.findByPk(p.merchantId);
      let merchantId = merchant.id
      console.log('merchantid: ' + merchantId)
      if(merchantMapLineitems.has(merchantId)) {
        let items = merchantMapLineitems.get(merchantId);
        items.push(lineItem);
        merchantMapLineitems.set(merchantId, items);
      } else {
        let items = new Array();
        items.push(lineItem);
        merchantMapLineitems.set(merchantId, items);
      } 
    }

    const invalidCartItems = await getInvalidCartItems(await cart.getLineItems());

    for(let [merchantId, lineItem] of merchantMapLineitems) {
      for(const invalidItem of invalidCartItems) {
        const objectKeys = Object.keys(invalidItem);
        if(objectKeys.includes('product')) {
          const invalidProductId = invalidItem.product.id;
          for(let itemIndex = 0; itemIndex < lineItem.length; itemIndex++) {
            if(!Checker.isEmpty(lineItem[itemIndex].product) && lineItem[itemIndex].product.id === invalidProductId && Checker.isEmpty(invalidItem.product.quantityNotZero)) {
              lineItem.splice(itemIndex, 1);
              --itemIndex;
              await LineItem.destroy({ where: { productId: invalidProductId } });
            }
          }
        } else {
          const invalidProductVariationId = invalidItem.productVariation.id;
          for(let itemIndex = 0; itemIndex < lineItem.length; itemIndex++) {
            if(!Checker.isEmpty(lineItem[itemIndex].productVariation) && lineItem[itemIndex].productVariation.id === invalidProductVariationId && Checker.isEmpty(invalidItem.productVariation.quantityNotZero)) {
              lineItem.splice(itemIndex, 1);
              --itemIndex;
              await LineItem.destroy({ where: { productId: invalidProductVariationId } });
            }
          }
        }
      }

      console.log(merchantId)
      cartItems.push({ 
        merchant: await Merchant.findByPk(merchantId),
        lineItems: lineItem
       })
    }
    console.log(cartItems);
    return { cartItems, invalidCartItems};
  }
}