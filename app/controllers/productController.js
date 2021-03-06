const sequelize = require('../common/database');
const ProductService = require('../services/productService');
const { sendErrorResponse } = require('../common/error/errorHandler');
const fs = require('fs-extra');
const Checker = require('../common/checker');

module.exports = {
  createProduct: async(req, res) => {    
    let imageArray = req.body.images;
    try {
      const productData = req.body;
      let product;
      await sequelize.transaction(async (transaction) => {
        product = await ProductService.createProduct(productData, transaction);
      });
      return res.status(200).send(product);
    } catch (err) {
      while(!Checker.isEmpty(imageArray)) {
        fs.remove(imageArray.pop());
      }
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  //send an array of image strings
  addImageForProduct: async (req, res) => {
    try {
      let array = new Array();
      let i = 0
      while(!Checker.isEmpty(req.files[i])) {
        array.push(req.files[i].filename);
        i++;
      }
      return res.status(200).send(array);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  updateProduct: async(req, res) => {
    let imageArray = req.body.images;
    try {
      const { id } = req.params;
      const productData = req.body;
      await sequelize.transaction(async (transaction) => {
        product = await ProductService.updateProduct(id, productData, transaction);
      });
      return res.status(200).send(product);
    } catch (err) {
      while(!Checker.isEmpty(imageArray)) {
        fs.remove(imageArray.pop());
      }
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  deleteProduct: async(req, res) => {
    try {
      let product;
      const { id } = req.params;
      await sequelize.transaction(async (transaction) => {
        product = await ProductService.deleteProduct(id, transaction);
      });
      return res.status(200).send();
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },


  toggleDisableProduct: async(req, res) => {
    try {
      let product;
      const { id } = req.params;
      await sequelize.transaction(async (transaction) => {
        product = await ProductService.toggleDisableProduct(id, transaction);
      });
      return res.status(200).send(product);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveProduct: async(req, res) => {
    try {
      const { id } = req.params;
      return res.status(200).send(await ProductService.retrieveProduct(id));
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveAllProduct: async(req, res) => {
    try {
      let products = await ProductService.retrieveAllProduct();
      return res.status(200).send(products);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveProductByCategoryId: async(req, res) => {
    try {
      let { categoryId } = req.params;
      let products = await ProductService.retrieveProductByCategoryId(categoryId);
      return res.status(200).send(products);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveProductByMerchantId: async(req, res) => {
    try {
      let { merchantId } = req.params;
      let products = await ProductService.retrieveProductByMerchantId(merchantId);
      return res.status(200).send(products);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveMostPopularProducts: async(req, res) => {
    try {
      const { quantity } = req.params;
      const products = await ProductService.retrieveMostPopularProducts(quantity);
      return res.status(200).send(products);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveMostRecentProducts: async(req, res) => {
    try {
      const { quantity } = req.params;
      const products = await ProductService.retrieveMostRecentProducts(quantity);
      return res.status(200).send(products);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  searchProducts: async(req, res) => {
    try {
      const { searchTerm } = req.body;
      const products = await ProductService.searchProducts(searchTerm);
      return res.status(200).send(products);
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  }
}