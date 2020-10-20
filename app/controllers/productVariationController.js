const { sendErrorResponse } = require('../common/error/errorHandler');
const sequelize = require('../common/database');
const ProductVariationService = require('../services/productVariationService');
const fs = require('fs-extra');

module.exports = {

  addImageForProductVariation: async (req, res) => {
    try {
      return res.status(200).send(req.files[0].filename);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  createProductVariation: async(req, res) => {
    const { image } = req.body.image;
    try {
      const productVariationData = req.body;
      await sequelize.transaction(async (transaction) => {
        productVariation = await ProductVariationService.createProductVariation(productVariationData, transaction);
      }); 
      return res.status(200).send(productVariation);
    } catch (err) {
      fs.remove(image);
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  updateProductVariation: async(req, res) => {
    const productVariationData = req.body;
    const updateKeys = Object.keys(productData);
    if(updateKeys.includes('image')) {
      const { image } = req.body.image;
    }
    
    try {
      const { id } = req.params;
      await sequelize.transaction(async (transaction) => {
        productVariation = await ProductVariationService.updateProductVariation(id, productVariationData, transaction);
      }); 
      return res.status(200).send(productVariation);
    } catch (err) {
      fs.remove(image);
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  toggleDisableProductVariation: async(req, res) => {
    try {
      const { id } = req.params;
      await sequelize.transaction(async (transaction) => {
        productVariation = await ProductVariationService.toggleDisableProductVariation(id, transaction);
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

  retrieveProductVariationsByProductIdIncludingDisabled: async(req, res) => {
    try {
      const { id } = req.params;
      productVariations = await ProductVariationService.retrieveProductVariationsByProductIdIncludingDisabled(id);
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
