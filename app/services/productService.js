const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');

const Product = require('../models/Product');

module.exports = {
  createProduct: async(productData, transaction) => {
    const {name, unitPrice, description, quantityAvailable, image} = productData;
    Checker.ifEmptyThrowError(name, Constants.Error.NameRequired);
    Checker.ifEmptyThrowError(image, Constants.Error.ImageRequired);
    Checker.ifEmptyThrowError(quantityAvailable, Constants.Error.QuantityAvailableRequired);
    Checker.ifEmptyThrowError(unitPrice, Constants.Error.UnitPriceRequired);
    
    if(unitPrice <= 0) {
      throw new CustomError("Unit price " + Constants.Error.CannotBeNegative);
    }
    if(quantityAvailable <= 0) {
      throw new CustomError("Quantity available " + Constants.Error.CannotBeNegative);
    }
    const product = await Product.create(productData, { transaction });

    return product;
  },

}