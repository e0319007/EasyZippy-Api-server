const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');
const Merchant = require('../models/Merchant');
const Promotion = require('../models/Promotion');
const Staff = require('../models/Staff');

module.exports = {
  createMerchantPromotion: async(promotionData, transaction) => {
    let { promoCode, startDate, endDate, description, termsAndConditions, percentageDiscount, flatDiscount, usageLimit, merchantId, minimumSpend } = promotionData;
    Checker.ifEmptyThrowError(promoCode, 'Promo code ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(startDate, 'Start date ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(endDate, 'End date ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(usageLimit, 'Usage limit ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(merchantId, 'Merchant ID ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(await Merchant.findByPk(merchantId), Constants.Error.MerchantNotFound);
    if(startDate > endDate) {
      throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    }
    if(!Checker.isEmpty(await Promotion.findOne({ where: { promoCode, expired: false } }))) {
      throw new CustomError(Constants.Error.PromoCodeNotUnique);
    }
    if(startDate.getTime() < new Date().getTime()) {
      throw new CustomError(Constants.Error.InvalidDate)
    }
    let promotionTypeEnum = Constants.PromotionType.MerchantPromotion;
    
    if(Checker.isEmpty(percentageDiscount) && Checker.isEmpty(flatDiscount)) {
      throw new CustomError('Percentage discount or flat discount ' + Constants.Error.XXXIsRequired);
    }
    let promotion = await Promotion.create({ promoCode, startDate, endDate, description, termsAndConditions, percentageDiscount, flatDiscount, usageLimit, promotionTypeEnum, merchantId, minimumSpend }, { transaction });
    return promotion;
  },

  createMallPromotion: async(promotionData, transaction) => {
    let { promoCode, startDate, endDate, description, termsAndConditions, percentageDiscount, flatDiscount, usageLimit, staffId, minimumSpend } = promotionData;
    Checker.ifEmptyThrowError(promoCode, 'Promo code ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(startDate, 'Start date ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(endDate, 'End date ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(usageLimit, 'Usage limit ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(staffId, 'Staff ID ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(await Staff.findByPk(staffId), Constants.Error.StaffNotFound);
    if(startDate > endDate) {
      throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    }
    if(startDate.getTime() < new Date().getTime()) {
      throw new CustomError(Constants.Error.InvalidDate)
    }
    if(!Checker.isEmpty(await Promotion.findOne({ where: { promoCode, expired: false } }))) {
      throw new CustomError(Constants.Error.PromoCodeNotUnique);
    }
    let promotionTypeEnum = Constants.PromotionType.MallPromotion;
    
    if(Checker.isEmpty(percentageDiscount) && Checker.isEmpty(flatDiscount)) {
      throw new CustomError('Percentage discount or flat discount ' + Constants.Error.XXXIsRequired);
    }
    let promotion = await Promotion.create({ promoCode, startDate, endDate, description, termsAndConditions, percentageDiscount, flatDiscount, usageLimit, staffId, promotionTypeEnum, minimumSpend }, { transaction });
    return promotion;
  },

  updatePromotion: async(id, promotionData, transaction) => {
    let { promoCode, startDate, endDate, description, termsAndConditions, percentageDiscount, flatDiscount, usageLimit, minimumSpend} = promotionData;
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let promotion = await Promotion.findByPk(id);
    Checker.ifDeletedThrowError(promotion, 'Promotion ' + Constants.Error.PromotionDeleted);
    Checker.ifEmptyThrowError(promotion, Constants.Error.PromotionNotFound);
    let updateKeys = Object.keys(promotionData);
    if(updateKeys.includes('promoCode')) {
      Checker.ifEmptyThrowError(promoCode, 'Promo Code ' + Constants.Error.XXXIsRequired);
      let p = await Promotion.findOne({ where: { promoCode, expired: false } });
      if(!Checker.isEmpty(p) && p.id != id) {
        throw new CustomError(Constants.Error.PromoCodeNotUnique);
      }
    }
    if(updateKeys.includes('startDate')) {
      Checker.ifEmptyThrowError(startDate, 'Start date ' + Constants.Error.XXXIsRequired);
      if(startDate > endDate) {
        throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
      }
      if(startDate.getTime() < new Date().getTime()) {
        throw new CustomError(Constants.Error.InvalidDate)
      }
    }
    if(updateKeys.includes('endDate')) {
      Checker.ifEmptyThrowError(endDate, 'End date ' + Constants.Error.XXXIsRequired);
      if(startDate > endDate) {
        throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
      }
    }
    if(updateKeys.includes('usageLimit')) {
    Checker.ifEmptyThrowError(usageLimit, 'Usage Limit ' + Constants.Error.XXXIsRequired);
    }
    promotion = await Promotion.update(promotionData, { transaction, where: { id }, returning: true });
    return promotion;
  },

  retrieveAllMallPromotions: async() => {
    return await Promotion.findAll({ where: { promotionTypeEnum: Constants.PromotionType.MallPromotion, deleted: false } });
  },

  retrieveAllMerchantPromotions: async() => {
    return await Promotion.findAll({ where: { promotionTypeEnum: Constants.PromotionType.MerchantPromotion, deleted: false } });
  },
  
  retrieveMerchantPromotionByMerchantId: async(merchantId) => {
    Checker.ifEmptyThrowError(merchantId, 'Merchant ID ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(await Merchant.findByPk(merchantId), Constants.Error.MerchantNotFound);
    return await Promotion.findAll({ where: { merchantId, promotionTypeEnum: Constants.PromotionType.MerchantPromotion, deleted: false } });
  },

  retrievePromotionByPromoCode: async(promoCode) => {
    Checker.ifEmptyThrowError(promoCode, 'Promotion Code ' + Constants.Error.XXXIsRequired);
    let promotion = await Promotion.findAll({ where: { deleted: false, expired: false, promoCode } });
    Checker.ifEmptyThrowError(promotion, Constants.Error.PromotionNotFound);
    return promotion;
  },

  retrieveAllPromotions: async() => {
    return await Promotion.findAll({ where: { deleted: false } });
  },

  deletePromotion: async(id, transaction) => {
    Checker.ifEmptyThrowError(id);
    let promotion = await Promotion.findByPk(id);
    Checker.ifEmptyThrowError(promotion, Constants.Error.ProductNotFound);
    Checker.ifDeletedThrowError(promotion, Constants.Error.PromotionDeleted);
    if(promotion.usageCount > 0) {
      throw new CustomError(Constants.Error.PromotionCannotBeDeleted);
    }
    await Promotion.update({ deleted: true }, { where: { id }, transaction });
  },
}