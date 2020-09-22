const sequelize = require('../common/database');
const ProductService = require('../services/productService');
const { sendErrorResponse } = require('../common/error/errorHandler');
const fs = require('fs-extra');
const Checker = require('../common/checker');

module.exports = {
  createProduct: async(req, res) => {
    let temp = new Array();
    let imageArray = new Array();
    let imageString = "";
    images = req.body.images;
    console.log(images + "\n");

    temp = images.split(",");
    temp.forEach(x => {
      x.trim(); 
      imageString += x;
      imageArray.push(x);
    });
    
    try {
      const productData = req.body;
      let product;
      await sequelize.transaction(async (transaction) => {
        product = await ProductService.createProduct(productData, imageString, transaction);
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

  //send a string with comma separating each image
  addImageForProduct: async (req, res) => {
    try {
      // let array = new Array();
      // let i = 0
      // while(!Checker.isEmpty(req.files[i])) {
      //   array.push('./app/assets/' + req.files[i].filename);
      //   i++;
      // }
      let i = 0;
      let imageString = "";
      while(!Checker.isEmpty(req.files[i])) {
        imageString += './app/assets/' + req.files[i].filename + ",";
        i++;
      }
      return res.status(200).send(imageString.slice(0,-1));
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  }
}