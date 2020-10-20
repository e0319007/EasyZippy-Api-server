const { sendErrorResponse } = require('../common/error/errorHandler');
const sequelize = require('../common/database');
const ProductVariationService = require('../services/productVariationService');

module.exports = {
  createProductVariation: async(req, res) => {
    try {
      const productVariationData = req.body;
      await sequelize.transaction(async (transaction) => {
        productVariation = await ProductVariationService.createProductVariation(productVariationData, transaction);
      }); 
      return res.status(200).send(productVariation);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  updateProductVariation: async(req, res) => {
    try {
      const { id } = req.params;
      const productVariationData = req.body;
      await sequelize.transaction(async (transaction) => {
        productVariation = await ProductVariationService.updateProductVariation(id, productVariationData, transaction);
      }); 
      return res.status(200).send(productVariation);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveProductVariationsByProductId: async(req, res) => {
    try {
      const { id } = req.params;
      productVariations = await ProductVariationService.retrieveProductVariationsByProductId(id);
      return res.status(200).send(productVariations);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  deleteProductVariation: async(req, res) => {
    try {
      const { id } = req.params;
      await sequelize.transaction(async (transaction) => {
        await ProductVariationService.deleteProductVariation(id, transaction);
      });
      return res.status(200).send();
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },
}
