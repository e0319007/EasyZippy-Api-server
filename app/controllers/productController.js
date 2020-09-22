const sequelize = require('../common/database');
const ProductService = require('../services/productService');
const { sendErrorResponse } = require('../common/error/errorHandler');
const fs = require('fs-extra');

module.exports = {
  createProduct: async(req, res) => {
    const image = req.body.image;
    try {
      const productData = req.body;
      let product;
      await sequelize.transaction(async (transaction) => {
        product = await ProductService.createProduct(productData, transaction);
      });
      return res.status(200).send(product);
    } catch (err) {
      fs.remove(image);
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  addImageForProduct: async (req, res) => {
    try {
      const fileName = './app/assets/' + req.files[0].filename;
      return res.status(200).send(fileName);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  }
}