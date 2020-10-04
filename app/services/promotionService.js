const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');
const Merchant = require('../models/Merchant');
const Promotion = require('../models/Promotion');
const Staff = require('../models/Staff');

module.exports = {
  createMerchantPromotion: async(promotionData, transaction) => {
    let { promoCode, startDate, endDate, description, termsAndConditions, percentageDiscount, flatDiscount, usageLimit, merchantId, promotionType} = promotionData;
    Checker.ifEmptyThrowError(promoCode, 'Promo Code' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(startDate, 'Start date' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(endDate, 'End date' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(usageLimit, 'End date' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(merchantId, 'Merchant ID' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(await Merchant.findByPk(merchantId), Constants.Error.MerchantNotFound);
    if(startDate > endDate) {
      throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    }
    promotionType = Constants.PromotionType.MerchantPromotion;
    
    if(Checker.isEmpty(percentageDiscount) && Checker.isEmpty(flatDiscount)) {
      throw new CustomError('Percentage discount or flat discount ' + Constants.Error.XXXIsRequired);
    }
    let promotion = await Promotion.create(promotionData, { transaction });
    return promotion;
  },

  createMallPromotion: async(promotionData, transaction) => {
    let { promoCode, startDate, endDate, description, termsAndConditions, percentageDiscount, flatDiscount, usageLimit, staffId, promotionType} = promotionData;
    Checker.ifEmptyThrowError(promoCode, 'Promo Code' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(startDate, 'Start date' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(endDate, 'End date' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(usageLimit, 'Usage Limit' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(staffId, 'Staff ID' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(await Staff.findByPk(staffId), Constants.Error.StaffNotFound);
    if(startDate > endDate) {
      throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    }
    promotionType = Constants.PromotionType.MallPromotion;
    
    if(Checker.isEmpty(percentageDiscount) && Checker.isEmpty(flatDiscount)) {
      throw new CustomError('Percentage discount or flat discount ' + Constants.Error.XXXIsRequired);
    }
    let promotion = await Promotion.create(promotionData, { transaction });
    return promotion;
  },

  updatePromotion: async(id, promotionData, transaction) => {
    let { promoCode, startDate, endDate, description, termsAndConditions, percentageDiscount, flatDiscount, usageLimit} = promotionData;
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let promotion = await Promotion.findByPk(id);
    Checker.ifEmptyThrowError(promotion, Constants.Error.PromotionNotFound);
    if(updateKeys.includes('promoCode')) {
      Checker.ifEmptyThrowError(promoCode, 'Promo Code' + Constants.Error.XXXIsRequired);
    }
    if(updateKeys.includes('startDate')) {
      Checker.ifEmptyThrowError(startDate, 'Start date' + Constants.Error.XXXIsRequired);
      if(startDate > endDate) {
        throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
      }
    }
    if(updateKeys.includes('endDate')) {
      Checker.ifEmptyThrowError(endDate, 'End date' + Constants.Error.XXXIsRequired);
      if(startDate > endDate) {
        throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
      }
    }
    if(updateKeys.includes('usageLimit')) {
    Checker.ifEmptyThrowError(usageLimit, 'Usage Limit' + Constants.Error.XXXIsRequired);
    }
    promotion = await Promotion.update(promotionData, { transaction, where: { id } });
  },

  retrieveMallPromotion: async() => {
    return await Promotion.findAll({ where: { promotionType: Constants.PromotionType.MallPromotion } });
  },
  
  retrieveMerchantPromotionByMerchantId: async(id) => {
    Checker.ifEmptyThrowError(merchantId, 'Merchant ID' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(await Merchant.findByPk(merchantId), Constants.Error.MerchantNotFound);
    return await Promotion.findAll({ where: { merchantId: id, promotionType: Constants.PromotionType.MerchantPromotion } })
  },

  deletePromotion: async(id, transaction) => {
    Checker.ifEmptyThrowError(id);
    let promotion = await Promotion.findByPk(id);
    Checker.ifEmptyThrowError(promotion, Constants.Error.ProductNotFound);
    if(promotion.used) {
      throw new CustomError(Constants.Error.PromotionCannotBeDeleted);
    }
    await Promotion.update({ deleted: true }, { where: { id }, transaction });
  },
}