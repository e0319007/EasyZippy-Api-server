const { order } = require('paypal-rest-sdk');
const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');
const CreditPaymentRecord = require('../models/CreditPaymentRecord');
const Customer = require('../models/Customer');
const LineItem = require('../models/LineItem');
const Merchant = require('../models/Merchant');
const Order = require('../models/Order');
const Product = require('../models/Product');
const ProductVariation = require('../models/ProductVariation');
const Promotion = require('../models/Promotion');
const CreditPaymentRecordService = require('./creditPaymentRecordService');

module.exports = {
  retrieveOrderByCustomerId: async(customerId) => {
    Checker.isEmpty(customerId, Constants.Error.IdRequired)
    Checker.isEmpty(await Customer.findByPk(customerId), Constants.Error.CustomerNotFound);
    return await Order.findAll({ where: { customerId } });
  },

  retrieveOrderByMerchantId: async(merchantId) => {
    Checker.isEmpty(merchantId, Constants.Error.IdRequired)
    Checker.isEmpty(await Merchant.findByPk(merchantId), Constants.Error.MerchantNotFound);
    return await Order.findAll({ where: { merchantId } });
  },

  retrieveAllOrders: async() => {
    return await Order.findAll();
  },

  retrieveOrderById: async(orderId) => {
    Checker.isEmpty(orderId, Constants.Error.IdRequired);
    let order = await Order.findByPk(orderId);
    return order;
  },

  updateOrderStatus: async(id, orderStatusEnum, transaction) => {
    Checker.ifEmptyThrowError(orderStatusEnum, 'Order status ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let order = await Order.findByPk(id);
    Checker.ifEmptyThrowError(order, Constants.Error.OrderNotFound);

    if(orderStatusEnum === Constants.OrderStatus.Complete) return await markOrderComplete(order, transaction);
    order = await Order.update({ orderStatusEnum }, { where: { id }, transaction, returning: true });
    return order;
  },

  createOrder: async(orderData, transaction) => {
    let { cart, promoIdUsed, collectionMethodEnum, totalAmountPaid, customerId } = orderData;
    if(!Checker.isEmpty(promoIdUsed)) {
      Checker.ifEmptyThrowError(await Promotion.findByPk(promoIdUsed), Constants.Error.PromotionNotFound);
    }
    Checker.ifEmptyThrowError(collectionMethodEnum, 'Collection method enum ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(totalAmountPaid, 'Total amount ' + Constants.Error.XXXIsRequired)
    Checker.ifNegativeThrowError(totalAmountPaid, 'Total amount ' + Constants.Error.XXXCannotBeNegative);
    Checker.ifNotNumberThrowError(totalAmountPaid, 'Total amount ' + Constants.Error.XXXMustBeNumber);
    Checker.isEmpty(customerId, Constants.Error.IdRequired)
    Checker.isEmpty(await Customer.findByPk(customerId), Constants.Error.CustomerNotFound);

    let lineItemsArray = new Array();

    while(!Checker.isEmpty(cart)) {
      let lt = cart.pop(); 
      let merchantId;
      if(lt.productId === null) {
        merchantId = (await Product.findByPk(lt.productId)).merchantId;
      } else {
        merchantId = (await Product.findByPk((await ProductVariation.findByPk(lt.productVariationId).productId))).merchantId;
      }
      Checker.ifEmptyThrowError(merchantId, Constants.Error.MerchantNotFound)
      let lineItem = await LineItem.create({ productId: lt.productId, productVariationId: lt.productVariationId, quantity: lt.quantity }, { transaction })
      let lineItemMerchantIdPair = {
        'lineItem': lineItem,
        'merchantId': merchantId
      }
      lineItemsArray.push(lineItemMerchantIdPair);
    }
  
    let merchantMapLineitems = new Map();

    for(let limp of lineItemsArray) {
      Checker.ifEmptyThrowError(await Merchant.findByPk(limp.merchantId), Constants.Error.MerchantNotFound);
      if(merchantMapLineitems.has(limp.merchantId)) {
        let items = merchantMapLineitems.get(limp.merchantId);
        items.push(limp.lineItem);
        merchantMapLineitems.set(merchantId, items);
      } else {
        let items = new Array();
        items.push(limp.lineItem);
        merchantMapLineitems.set(limp.merchantId, items);
      } 
    }

    let orders; 
    let trackTotalAmount = 0;

    for (let [merchantId, lineItems] of merchantMapLineitems) {
      let totalAmount = await applyPromoCode(await calculatePrice(lineItems));
      trackTotalAmount += totalAmount;
      let creditPaymentRecordId = await CreditPaymentRecordService.payCreditCustomer(customerId, totalAmount, Constants.CreditPaymentType.Order, transaction).id;
      let order = await Order.create({ promoIdUsed, totalAmount, collectionMethodEnum, customerId, merchantId, creditPaymentRecordId }, { transaction });
      orders.push(order);
    }

    if(totalAmountPaid != trackTotalAmount) throw new CustomError(Constants.Error.PriceDoesNotTally);

    return orders;
  },

}

const markOrderComplete = async(order, transaction) => {
  let creditPaymentRecord = await CreditPaymentRecordService.refundCreditMerchant(order.merchantId, order.amountPaid, Constants.CreditPaymentType.Order, transaction);
  let creditPaymentRecords = await CreditPaymentRecord.findAll({ where: { orderId: order.id } });
  creditPaymentRecords.push(creditPaymentRecord);
  let order = await order.update({ orderStatusEnum: Constants.OrderStatus.Complete, creditPaymentRecords }, { where: { id }, transaction, returning: true });
  return order;
}

const calculatePrice = async(lineItems) => {
  let price = 0;
  for(let lineItem of lineItems) {
    if(lineItem.productId === null) {
      price += ((await Product.findByPk(lineItem.productId)).unitPrice * lineItem.quantity);
    } else {
      price += ((await Product.findByPk((await ProductVariation.findByPk(lineItem.productVariationId).productId))).unitPrice * lineItem.quantity);
    }
  }
  return price;
}

const applyPromoCode = async(promoIdUsed, price) => {
  if(!Checker.isEmpty(promoIdUsed)) {
    let promotion = await Promotion.findByPk(promoIdUsed);
    Checker.ifEmptyThrowError(promotion, Constants.Error.PromotionNotFound);
    if(promotion.startDate <= new Date() && promotion.endDate >= new Date()) {
      if(!Checker.isEmpty(promotion.flatDiscount)) {
        price -= promotion.flatDiscount;
      } else {
        price *= (1 - promotion.percentageDiscount);
      }
    }
  } 
  return price;
}