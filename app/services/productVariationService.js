const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');
const Product = require('../models/Product');
const ProductVariation = require('../models/ProductVariation');
const fs = require('fs-extra');

module.exports = {
  createProductVariation: async(productVariationData, transaction) => {
    let {name, unitPrice, quantityAvailable, image, productId} = productVariationData;
    Checker.ifNotNumberThrowError(unitPrice, 'Unit price ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNotNumberThrowError(quantityAvailable, 'Quantity available ' + Constants.Error.XXXMustBeNumber);

    Checker.ifEmptyThrowError(name, Constants.Error.NameRequired);
    Checker.ifEmptyThrowError(quantityAvailable, Constants.Error.QuantityAvailableRequired);
    Checker.ifEmptyThrowError(unitPrice, Constants.Error.UnitPriceRequired);
    Checker.ifEmptyThrowError(productId, Constants.Error.CategoryIdRequired)
    Checker.ifEmptyThrowError(await Product.findByPk(productId), Constants.Error.ProductNotFound)
    Checker.ifDeletedThrowError(await Product.findByPk(productId), Constants.Error.ProductVariationDeleted); 
    if(unitPrice <= 0) {
      throw new CustomError("Unit price " + Constants.Error.XXXCannotBeNegative);
    }
    if(quantityAvailable <= 0) {
      throw new CustomError("Quantity available " + Constants.Error.XXXCannotBeNegative);
    }

    return await ProductVariation.create(productVariationData, { transaction });
  },

  updateProductVariation: async(id, productVariationData, transaction) => {
    let {name, unitPrice, quantityAvailable, image} = productVariationData;
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let productVariation = await ProductVariation.findByPk(id);

    Checker.ifEmptyThrowError(productVariation, Constants.Error.ProductVariationNotFound);
    Checker.ifDeletedThrowError(productVariation, Constants.Error.ProductVariationDeleted);

    const updateKeys = Object.keys(productData);
    if(updateKeys.includes('name')) {
      Checker.ifEmptyThrowError(name, Constants.Error.NameRequired);
    }
    if(updateKeys.includes('image')) {
      Checker.ifEmptyThrowError(image, Constants.Error.ImageRequired);
      fs.remove(productVariation.image);
    }
    if(updateKeys.includes('quantityAvailable')) {
      Checker.ifEmptyThrowError(quantityAvailable, Constants.Error.QuantityAvailableRequired);
      Checker.ifNotNumberThrowError(quantityAvailable, 'Quantity available ' + Constants.Error.XXXMustBeNumber);
      if(quantityAvailable <= 0) {
        throw new CustomError("Quantity available " + Constants.Error.XXXCannotBeNegative);
      }
    }
    if(updateKeys.includes('unitPrice')) {
      Checker.ifEmptyThrowError(unitPrice, Constants.Error.UnitPriceRequired);
      Checker.ifNotNumberThrowError(unitPrice, 'Unit price ' + Constants.Error.XXXMustBeNumber);
      if(unitPrice <= 0) {
        throw new CustomError("Unit price " + Constants.Error.XXXCannotBeNegative);
      }
    }
    productVariation = await Product.update(productVariationData, { where: { id }, transaction, returning: true })
    return productVariation;
  },

  retrieveProductVariationsByProductId: async(id) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let product = await Product.findByPk(id);
    Checker.ifEmptyThrowError(product, Constants.Error.ProductNotFound);
    Checker.ifDeletedThrowError(product, Constants.Error.ProductDeleted); 
    return ProductVariation.findAll({ where: { deleted: false, disabled: false, productId: false } });
  },

  retrieveProductVariationsByProductIdIncludingDisabled: async(id) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let product = await Product.findByPk(id);
    Checker.ifEmptyThrowError(product, Constants.Error.ProductNotFound);
    Checker.ifDeletedThrowError(product, Constants.Error.ProductDeleted); 
    return ProductVariation.findAll({ where: { deleted: false, productId: false } });
  },

  deleteProductVariation: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let curProductVariation = await ProductVariation.findByPk(id);
    Checker.ifEmptyThrowError(curProductVariation, Constants.Error.ProductNotFound);
    await ProductVariation.update({
      deleted: true,
    }, { where: { id }, transaction, returning: true });
  },
}