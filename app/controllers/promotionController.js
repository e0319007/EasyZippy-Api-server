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
      let { id } = req.params;
      await sequelize.transaction(async (transaction) => {
        promotion = await PromotionService.updatePromotion(id, promoData, transaction);
      });
      return res.status(200).send(promotion);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveAllMallPromotions: async(req, res) => {
    try {
      return res.status(200).send(await PromotionService.retrieveAllMallPromotions());
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveAllMerchantPromotions: async(req, res) => {
    try {
      return res.status(200).send(await PromotionService.retrieveAllMerchantPromotions());
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveAllPromotions: async(req, res) => {
    try {
      return res.status(200).send(await PromotionService.retrieveAllPromotions());
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

  retrievePromotionByPromoCode: async(req, res) => {
    try {
      const { promoCode } = req.params
      return res.status(200).send(await PromotionService.retrievePromotionByPromoCode(promoCode));
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrievePromotionById: async(req, res) => {
    try {
      const { id } = req.params
      return res.status(200).send(await PromotionService.retrievePromotionById(id));
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