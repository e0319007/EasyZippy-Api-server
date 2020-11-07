const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CreditPaymentRecord = require('../models/CreditPaymentRecord');
const Customer = require('../models/Customer');
const LineItem = require('../models/LineItem');
const Merchant = require('../models/Merchant');
const Order = require('../models/Order');
const Product = require('../models/Product');
const ProductVariation = require('../models/ProductVariation');
const Promotion = require('../models/Promotion');
const CreditPaymentRecordService = require('./creditPaymentRecordService');
const CartService = require('./cartService');
const PromotionService = require('./promotionService');
const CustomError = require('../common/error/customError');
const NotificationHelper = require('../common/notificationHelper');

module.exports = {
  retrieveOrderByCustomerId: async(customerId) => {
    Checker.isEmpty(customerId, Constants.Error.IdRequired);
    Checker.isEmpty(await Customer.findByPk(customerId), Constants.Error.CustomerNotFound);
    return await Order.findAll({ where: { customerId } });
  },

  retrieveOrderByMerchantId: async(merchantId) => {
    Checker.isEmpty(merchantId, Constants.Error.IdRequired);
    Checker.isEmpty(await Merchant.findByPk(merchantId), Constants.Error.MerchantNotFound);
    return await Order.findAll({ where: { merchantId } });
  },

  retrieveAllOrders: async() => {
    return await Order.findAll();
  },

  retrieveOrderById: async(orderId) => {
    Checker.isEmpty(orderId, Constants.Error.IdRequired);
    let order = await Order.findByPk(orderId);
    Checker.ifEmptyThrowError(order, Constants.Error.OrderNotFound);
    return order;
  },

  retrieveAllOrderStatus: async() => {
    return Object.values(Constants.OrderStatus);
  },

  updateOrderStatus: async(id, orderStatusEnum, transaction) => {
    Checker.ifEmptyThrowError(orderStatusEnum, 'Order status ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let order = await Order.findByPk(id);
    Checker.ifEmptyThrowError(order, Constants.Error.OrderNotFound);
    console.log(order)
    if(orderStatusEnum === Constants.OrderStatus.COMPLETE) {
      return await markOrderComplete(order, transaction);
    } else if(orderStatusEnum === Constants.OrderStatus.READY_FOR_COLLECTION) {
      await NotificationHelper.notificationOrderReadyForCollection(id, order.customerId);
    }
    order = await Order.update({ orderStatusEnum }, { where: { id }, transaction, returning: true });
    return order;
  },

  createOrder: async(orderData, transaction) => {
    let { cart, promoIdUsed, collectionMethodEnum, totalAmountPaid, customerId } = orderData;

    Checker.ifEmptyThrowError(collectionMethodEnum, 'Collection method enum ' + Constants.Error.XXXIsRequired);
    // Checker.ifEmptyThrowError(totalAmountPaid, 'Total amount ' + Constants.Error.XXXIsRequired)
    // Checker.ifNegativeThrowError(totalAmountPaid, 'Total amount ' + Constants.Error.XXXCannotBeNegative);
    // Checker.ifNotNumberThrowError(totalAmountPaid, 'Total amount ' + Constants.Error.XXXMustBeNumber);
    Checker.isEmpty(customerId, Constants.Error.IdRequired);
    Checker.isEmpty(await Customer.findByPk(customerId), Constants.Error.CustomerNotFound);

    const invalidCartItems = await CartService.getInvalidCartItems(cart);
    
    if(!Checker.isEmpty(invalidCartItems)) {
      return { invalidCartItems };
    }

    let lineItemsArray = new Array();

    while(!Checker.isEmpty(cart)) {
      let lt = cart.pop();
      let merchantId;
      if(lt.productId !== null) {
        let product = await Product.findByPk(lt.productId);
        await product.update({ quantityAvailable: product.quantityAvailable - lt.quantity, quantitySold: lt.quantity + product.quantitySold }, { transaction });
        merchantId = product.merchantId;
      } else {
        let productVariation = await ProductVariation.findByPk(lt.productVariationId);
        await productVariation.update({ quantityAvailable: productVariation.quantityAvailable - lt.quantity}, { transaction });
        let product = await Product.findByPk(productVariation.productId);
        product = await product.update({ quantitySold: lt.quantity + product.quantitySold }, { transaction })
        merchantId = (await Product.findByPk(productVariation.productId)).merchantId;
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
        merchantMapLineitems.set(limp.merchantId, items);
      } else {
        let items = new Array();
        items.push(limp.lineItem);
        merchantMapLineitems.set(limp.merchantId, items);
      } 
    }

    let orders = new Array(); 
    let trackTotalAmount = 0;

    for (let [merchantId, lineItem] of merchantMapLineitems) {
      let totalAmount = await calculatePrice(lineItem);
      trackTotalAmount += totalAmount;
      let creditPaymentRecordId = (await CreditPaymentRecordService.payCreditCustomer(customerId, totalAmount, Constants.CreditPaymentType.ORDER, transaction)).id;
      let order = await Order.create({ lineItem, promoIdUsed, totalAmount, collectionMethodEnum, customerId, merchantId, creditPaymentRecordId }, { transaction });
      await order.setLineItems(lineItem, { transaction });
      orders.push(order);
    }

    let promotion;
    
    if(!Checker.isEmpty(promoIdUsed)) {
      promotion = await Promotion.findByPk(promoIdUsed);
      Checker.ifEmptyThrowError(promotion, Constants.Error.PromotionNotFound);
      if(!Checker.isEmpty(promotion.usageLimit) && promotion.usageLimit <= promotion.usageCount) {
        throw new CustomError(Constants.Error.PromotionUsageLimitReached);
      } 
      if(promotion.minimumSpent < trackTotalAmount) {
        throw new CustomError(Constants.Error.PromotionMinimumSpendNotMet);
      }
      for (let order of orders) {
        let priceAfterPromotion = await applyPromoCode(promoIdUsed, order.totalAmount)
        order = await order.update({ totalAmount: priceAfterPromotion }, { transaction });
      }
      await promotion.update({ usageCount: ++promotion.usageCount }, { transaction });
    }

    // if(totalAmountPaid != trackTotalAmount) throw new CustomError(Constants.Error.PriceDoesNotTally);

    return orders;
  },

  checkPromoCode: async(promoCode, cart) => {
    if(!Checker.isEmpty(promoCode)) {
      const promotion = await PromotionService.retrievePromotionByPromoCode(promoCode);
      if(!Checker.isEmpty(promotion.usageLimit) && promotion.usageLimit <= promotion.usageCount) {
        throw new CustomError(Constants.Error.PromotionUsageLimitReached);
      }
      if(promotion.minimumSpent < trackTotalAmount) {
        throw new CustomError(Constants.Error.PromotionMinimumSpendNotMet);
      }
    } else {
      throw new CustomError('Promotion ' + Constants.Error.IdRequired);
    }
  }
}

const markOrderComplete = async(order, transaction) => {
  console.log('Amount paid:' + order.amountPaid);
  console.log('order:');
  console.log(order);
  let creditPaymentRecord = await CreditPaymentRecordService.refundCreditMerchant(order.merchantId, order.totalAmount, Constants.CreditPaymentType.ORDER, transaction);
  let creditPaymentRecords = await CreditPaymentRecord.findAll({ where: { orderId: order.id } });
  creditPaymentRecords.push(creditPaymentRecord);
  order = await order.update({ orderStatusEnum: Constants.OrderStatus.COMPLETE, creditPaymentRecords }, { transaction, returning: true });
  await NotificationHelper.notificationOrderReceivedMerchant(order.id, order.merchantId)
  return order;
}

const calculatePrice = async(lineItems) => {
  let price = 0;
  console.log('LineItems: ')
  console.log(lineItems);
  for(let lineItem of lineItems) {
    console.log('productId:: ' + lineItem.productId);
    console.log('productVariationId: ' + lineItem.productVariationId);
    console.log(lineItem)
    if(lineItem.productId !== null) {
      price += ((await Product.findByPk(lineItem.productId)).unitPrice * lineItem.quantity);
    } else {
      price += ((await ProductVariation.findByPk(lineItem.productVariationId)).unitPrice * lineItem.quantity);
    }
  }
  return price;
}

const applyPromoCode = async(promoIdUsed, price) => {
  price = Number(price)
  let promotion;
  if(!Checker.isEmpty(promoIdUsed)) {
    console.log('PROMO ID USED' + promoIdUsed)
    promotion = await Promotion.findByPk(promoIdUsed);
    // Checker.ifEmptyThrowError(promotion, Constants.Error.PromotionNotFound);
    // if(Checker.isEmpty(promotion.usageLimit) && promotion.usageLimit <= promotion.usageCount) {
    //   throw new CustomError(Constants.Error.PromotionUsageLimitReached);
    // }
    // if(Checker.isEmpty(promotion.minimumSpend) && price < promotion.minimumSpend) {
    //   throw new CustomError(Constants.Error.PromotionMinimumSpendNotMet);
    // }
    if(promotion.startDate <= new Date() && promotion.endDate >= new Date()) {
      if(!Checker.isEmpty(promotion.flatDiscount)) {
        price -= promotion.flatDiscount;
      } else {
        price *= (1 - promotion.percentageDiscount);
      }
    }
  }
  // await promotion.update({ usageCount: ++promotion.usageCount }, { transaction });
  if(price < 0) return 0;
  price = price.toFixed(2);
  return price;
}