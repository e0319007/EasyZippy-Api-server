const { sendErrorResponse } = require('../common/error/errorHandler');
const sequelize = require('../common/database');
const PromotionService = require('../services/promotionService');

module.exports = {
  createMerchantPromotion: async(req, res) => {
    try {
      const promoData = req.body;
      await sequelize.transaction(async (transaction) => {
        promotion = await PromotionService.createMerchantPromotion(promoData, transaction);
      });
      return res.status(200).send(promotion);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  createMallPromotion: async(req, res) => {
    try {
      const promoData = req.body;
      await sequelize.transaction(async (transaction) => {
        promotion = await PromotionService.createMallPromotion(promoData, transaction);
      });
      return res.status(200).send(promotion);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  updatePromotion: async(req, res) => {
    try {
      const promoData = req.body;
      let promotion;
      await sequelize.transaction(async (transaction) => {
        promotion = await PromotionService.updatePromotion(promoData, transaction);
      });
      return res.status(200).send(promotion);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveMallPromotion: async(req, res) => {
    try {
      return res.status(200).send(await PromotionService.retrieveMallPromotion());
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveMerchantPromotionByMerchantId: async(req, res) => {
    try {
      const { id } = req.params
      return res.status(200).send(await PromotionService.retrieveMerchantPromotionByMerchantId(id));
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  deletePromotion: async(req, res) => {
    try {
      const { id } = req.params
      await sequelize.transaction(async (transaction) => {
        await PromotionService.deletePromotion(id, transaction);
      });
      return res.status(200).send();
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },
}