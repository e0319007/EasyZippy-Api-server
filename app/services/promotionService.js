const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');
const Promotion = require('../models/Promotion');

module.exports = {
  createMerchantPromotion: async(promotionData, transaction) => {
    const { promoCode, startDate, endDate, promoCode, description, termsAndConditions, percentageDiscount, flatDiscount, usageLimit, image }
  },

  createMallPromotion: async(promotionData, transaction) => {
    
  },

  updatePromotion: async(promotionData, transaction) => {
    
  },

  retrieveMallPromotion: async() => {
    
  },
  
  retrieveMerchantPromotionByMerchantId: async() => {
    
  },

  deletePromotion: async(id) => {
    Checker.ifEmptyThrowError(id);
    let promotion = await Promotion.findByPk(id);
    Checker.ifEmptyThrowError(promotion, Constants.Error.ProductNotFound);
    if(promotion.used) {
      throw new CustomError(Constants.Error.PromotionCannotBeDeleted);
    }
    await Promotion.destroy({ where: { id } });
  },
}