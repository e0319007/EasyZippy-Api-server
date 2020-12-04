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
const BookingService = require('./bookingService');
const CreditPaymentRecordService = require('./creditPaymentRecordService');
const CartService = require('./cartService');
const PromotionService = require('./promotionService');
const CustomError = require('../common/error/customError');
const NotificationHelper = require('../common/notificationHelper');

const retrieveOrderById = async(orderId) => {
  Checker.isEmpty(orderId, Constants.Error.IdRequired);
  let order = await Order.findByPk(orderId);
  Checker.ifEmptyThrowError(order, Constants.Error.OrderNotFound);
  const lineItems = await order.getLineItems();
  const items = new Array();
  for(const lineItem of lineItems) {
    if(!Checker.isEmpty(lineItem.productId)) {
      const product = await Product.findByPk(lineItem.productId);
      items.push({ product, quantity: lineItem.quantity });
    } else if(!Checker.isEmpty(lineItem.productVariationId)) {
      const productVariation = await ProductVariation.findByPk(lineItem.productVariationId);
      items.push({ productVariation, quantity: lineItem.quantity });
    }
  }
  return { order, items };
};

const markOrderComplete = async(order, transaction) => {
  let creditPaymentRecord;

  if(!Checker.isEmpty(order.promoIdUsed)){
    let promotion = Promotion.findByPk(order.promoIdUsed);
    if(promotion.promotionTypeEnum === Constants.PromotionType.MALL_PROMOTION) {
      creditPaymentRecord = await CreditPaymentRecordService.increaseCreditMerchant(order.merchantId, order.totalAmount, Constants.CreditPaymentType.ORDER, transaction);
    } else {
      creditPaymentRecord = await CreditPaymentRecordService.increaseCreditMerchant(order.merchantId, order.discountedAmount, Constants.CreditPaymentType.ORDER, transaction);
    }
  } else {
    creditPaymentRecord = await CreditPaymentRecordService.increaseCreditMerchant(order.merchantId, order.totalAmount, Constants.CreditPaymentType.ORDER, transaction);
  }

  let creditPaymentRecords = await CreditPaymentRecord.findAll({ where: { orderId: order.id } });
  creditPaymentRecords.push(creditPaymentRecord);
  order = await order.update({ orderStatusEnum: Constants.OrderStatus.COMPLETE, creditPaymentRecords }, { transaction, returning: true });
  await NotificationHelper.notificationOrderReceivedMerchant(order.id, order.merchantId)
  return order;
};

const calculatePrice = async(lineItems) => {
  let price = 0;
  for(let lineItem of lineItems) {
    if(lineItem.productId !== null) {
      price += ((await Product.findByPk(lineItem.productId)).unitPrice * lineItem.quantity);
    } else {
      price += ((await ProductVariation.findByPk(lineItem.productVariationId)).unitPrice * lineItem.quantity);
    }
  }
  return price;
};

const calculateCustomerRefund = async(order) => {
  if(Checker.isEmpty(order.discountedAmount)) {
    return order.totalAmount;
  }
  return order.discountedAmount;
};

const applyPromoCodeFlatDiscount = async(promoIdUsed, totalPrice, price) => {
  price = Number(price)
  let promotion;
  let discountedPrice;
  if(!Checker.isEmpty(promoIdUsed)) {
    promotion = await Promotion.findByPk(promoIdUsed);
    if(promotion.minimumSpent > totalPrice) throw new CustomError(Constants.Error.PromotionMinimumSpendNotMet);
    if(promotion.startDate <= new Date() && promotion.endDate >= new Date()) {
      discountedPrice = price - (price / totalPrice) * promotion.flatDiscount;
    } else {
      throw new CustomError(Constants.Error.PromotionExpired)
    }
  }
  if(price < 0) return 0;
  discountedPrice = discountedPrice.toFixed(2);
  return discountedPrice;
};

const applyPromoCodePercentageDiscount = async(promoIdUsed, price) => {
  price = Number(price)
  let promotion;
  if(!Checker.isEmpty(promoIdUsed)) {
    promotion = await Promotion.findByPk(promoIdUsed);
    if(promotion.startDate <= new Date() && promotion.endDate >= new Date()) {
        price *= (1 - promotion.percentageDiscount);
    } else {
      throw new CustomError(Constants.Error.PromotionExpired)
    }
  }
  if(price < 0) return 0;
  price = price.toFixed(2);
  return price;
};

module.exports = {
  retrieveOrderById,

  retrieveOrderByCustomerId: async(customerId) => {
    Checker.isEmpty(customerId, Constants.Error.IdRequired);
    Checker.isEmpty(await Customer.findByPk(customerId), Constants.Error.CustomerNotFound);
    const orders = await Order.findAll({ where: { customerId } });
    const orderAndItems = new Array();
    for(const order of orders) {
      const lineItems = await order.getLineItems();
      const items = new Array();
      for(const lineItem of lineItems) {
        if(!Checker.isEmpty(lineItem.productId)) {
          const product = await Product.findByPk(lineItem.productId);
          items.push({ product, quantity: lineItem.quantity });
        } else if(!Checker.isEmpty(lineItem.productVariationId)) {
          const productVariation = await ProductVariation.findByPk(lineItem.productVariationId);
          items.push({ productVariation, quantity: lineItem.quantity });
        }
      }
      orderAndItems.push({ order, items });
    }
    return orderAndItems;
  },

  retrieveOrderByMerchantId: async(merchantId) => {
    Checker.isEmpty(merchantId, Constants.Error.IdRequired);
    Checker.isEmpty(await Merchant.findByPk(merchantId), Constants.Error.MerchantNotFound);
    return await Order.findAll({ where: { merchantId }, include: { model: LineItem } });
  },

  retrieveAllOrders: async() => {
    return await Order.findAll();
  },

  retrieveAllOrderStatus: async() => {
    return Object.values(Constants.OrderStatus);
  },

  updateOrderStatus: async(id, orderStatusEnum, transaction) => {
    Checker.ifEmptyThrowError(orderStatusEnum, 'Order status ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let order = await Order.findByPk(id);
    Checker.ifEmptyThrowError(order, Constants.Error.OrderNotFound);
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
      if(!Checker.isEmpty(lt.productId)) {
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
      totalAmount = totalAmount.toFixed(2)
      totalAmount = Number(totalAmount)
      trackTotalAmount += totalAmount;
      let order = await Order.create({ lineItem, totalAmount, collectionMethodEnum, customerId, merchantId }, { transaction });
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
      if(promotion.promotionTypeEnum === Constants.PromotionType.MALL_PROMOTION) {
        for (let order of orders) {
          let discountedAmount;
          if(!Checker.isEmpty(promotion.percentageDiscount)) {
            discountedAmount = await applyPromoCodePercentageDiscount(promoIdUsed, order.totalAmount)
          } else {
            discountedAmount = await applyPromoCodeFlatDiscount(promoIdUsed, trackTotalAmount, order.totalAmount);
          }
          let creditPaymentRecordId = (await CreditPaymentRecordService.payCreditCustomer(customerId, discountedAmount, Constants.CreditPaymentType.ORDER, transaction)).id;
          await order.update({ discountedAmount, promoIdUsed, creditPaymentRecordId }, { transaction });
        }
      }
      if(promotion.promotionTypeEnum === Constants.PromotionType.MERCHANT_PROMOTION) {
        for (let order of orders) {
          if(order.merchantId === promotion.merchantId) {
            let discountedAmount = order.totalAmount;
            if(!Checker.isEmpty(promotion.percentageDiscount)) {
              discountedAmount = await applyPromoCodePercentageDiscount(promoIdUsed, order.totalAmount)
            } else {
              discountedAmount -= promotion.flatDiscount;
            }
            let creditPaymentRecordId = (await CreditPaymentRecordService.payCreditCustomer(customerId, discountedAmount, Constants.CreditPaymentType.ORDER, transaction)).id;
            await order.update({ discountedAmount, promoIdUsed, creditPaymentRecordId }, { transaction });
            continue;
          }
          let creditPaymentRecordId = (await CreditPaymentRecordService.payCreditCustomer(customerId, order.totalAmount, Constants.CreditPaymentType.ORDER, transaction)).id;
          await order.update({ creditPaymentRecordId }, { transaction });
        }
      }
      await promotion.update({ usageCount: ++promotion.usageCount }, { transaction });
    } else {
      for (let order of orders) {
        let creditPaymentRecordId = (await CreditPaymentRecordService.payCreditCustomer(customerId, order.totalAmount, Constants.CreditPaymentType.ORDER, transaction)).id;
        await order.update({ creditPaymentRecordId }, { transaction });
      }
    }
    await CartService.saveItemsToCart(customerId, [])
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
  },

  markOrderCancel: async(id, transaction) => {
    const order = await Order.findByPk(id);
    Checker.ifEmptyThrowError(order, Constants.Error.OrderNotFound);
    if(order.orderStatusEnum === Constants.OrderStatus.CANCELLED) {
      throw new CustomError(Constants.Error.OrderAlreadyCancelled);
    }
    const refundAmount = await calculateCustomerRefund(order);

    if(order.orderStatusEnum === Constants.OrderStatus.READY_FOR_COLLECTION && order.collectionMethodEnum === Constants.CollectionMethod.KIOSK) {
      await BookingService.removeCollectorToBooking(order.id, transaction);
    }

    if(order.orderStatusEnum === Constants.OrderStatus.COMPLETE) {
      let merchantRefundAmount = refundAmount;
      if(!Checker.isEmpty(order.promoIdUsed)) {
        const promotion = await Promotion.findByPk(order.promoIdUsed);
        Checker.ifEmptyThrowError(promotion, Constants.Error.PromotionNotFound);
        if(promotion.promotionTypeEnum === Constants.PromotionType.MALL_PROMOTION) {
          merchantRefundAmount = order.totalAmount;
        }
      }
      await CreditPaymentRecordService.payCreditMerchant(order.merchantId, merchantRefundAmount, Constants.CreditPaymentType.REFUND, transaction);
    }

    const orderAndItems = await retrieveOrderById(order.id);
    for (const item of orderAndItems.items) {
      if(!Checker.isEmpty(item.product)) {
        item.product.quantityAvailable += item.quantity;
        await item.product.save();
      } else {
        item.productVariation.quantityAvailable += item.quantity;
        await item.productVariation.save();
      }
    }

    await CreditPaymentRecordService.increaseCreditCustomer(order.customerId, refundAmount, Constants.CreditPaymentType.REFUND, transaction);
    order.orderStatusEnum = Constants.OrderStatus.CANCELLED;
    return await order.save();
  }
};