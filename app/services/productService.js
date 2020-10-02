const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');
const Merchant = require('../models/Merchant');

const Product = require('../models/Product');
const Category = require('../models/Category');

const fs = require('fs-extra');

module.exports = {
  createProduct: async(productData, transaction) => {
    let {name, unitPrice, description, quantityAvailable, images, categoryId, merchantId} = productData;

    Checker.ifNotNumberThrowError(unitPrice, 'Unit price ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNotNumberThrowError(quantityAvailable, 'Quantity available ' + Constants.Error.XXXMustBeNumber);

    Checker.ifEmptyThrowError(name, Constants.Error.NameRequired);
    Checker.ifEmptyThrowError(images, Constants.Error.ImageRequired);
    Checker.ifEmptyThrowError(quantityAvailable, Constants.Error.QuantityAvailableRequired);
    Checker.ifEmptyThrowError(unitPrice, Constants.Error.UnitPriceRequired);
    Checker.ifEmptyThrowError(categoryId, Constants.Error.CategoryIdRequired)
    Checker.ifEmptyThrowError(merchantId, Constants.Error.MerchantIdRequired)
    Checker.ifEmptyThrowError(await Merchant.findByPk(merchantId), Constants.Error.MerchantNotFound)
    Checker.ifEmptyThrowError(await Category.findByPk(categoryId), Constants.Error.CategoryNotFound)
    if(unitPrice <= 0) {
      throw new CustomError("Unit price " + Constants.Error.XXXCannotBeNegative);
    }
    if(quantityAvailable <= 0) {
      throw new CustomError("Quantity available " + Constants.Error.XXXCannotBeNegative);
    }
    const product = await Product.create(productData, { transaction });
    
    return product;
  },

  updateProduct: async(id, productData, transaction) => {
    let {name, unitPrice, description, quantityAvailable, images, categoryId, merchantId} = productData;
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let product = await Product.findByPk(id);

    Checker.ifEmptyThrowError(product, Constants.Error.ProductNotFound)

    const updateKeys = Object.keys(productData);
    if(updateKeys.includes('name')) {
      Checker.ifEmptyThrowError(name, Constants.Error.NameRequired);
    }
    if(updateKeys.includes('images')) {
      Checker.ifEmptyThrowError(images, Constants.Error.ImageRequired);
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
    if(updateKeys.includes('categoryId')) {
      Checker.ifEmptyThrowError(categoryId, Constants.Error.CategoryIdRequired)
    }
    if(updateKeys.includes('merchantId')) {
      Checker.ifEmptyThrowError(merchantId, Constants.Error.MerchantIdRequired)
    }

    while(!Checker.isEmpty(product.images)) {
      fs.remove(product.images.pop());
    } 

    Checker.ifEmptyThrowError(await Merchant.findByPk(merchantId), Constants.Error.MerchantNotFound)
    Checker.ifEmptyThrowError(await Category.findByPk(categoryId), Constants.Error.CategoryNotFound)
    
    //product = await product.update(productData, { transaction, returning: true });
    product = await Product.update(productData, { where: { id }, transaction, returning: true })
    return product;
  },
  
  //merchants and customers cannot see product, only staff can see the product
  //only archived products can be disabled
  setDisableProduct: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let curProduct = await Product.findByPk(id);
    Checker.ifEmptyThrowError(curProduct, Constants.Error.ProductNotFound);
    if(!curProduct.archived) {
      throw new CustomError(Constants.Error.ProductDisableError);
    }
    await Product.update({
      disabled: true,
    }, { where: { id }, transaction, returning: true });
    return await Product.findByPk(id);
  },

  //customers cannot see product, merchants and staff can see the product
  toggleArchiveProduct: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let curProduct = await Product.findByPk(id);
    Checker.ifEmptyThrowError(curProduct, Constants.Error.ProductNotFound);
    await Product.update({
      archived: !curProduct.archived,
    }, { where: { id }, transaction, returning: true });
    return await Product.findByPk(id);
  },

  retrieveProduct: async(id) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let product = await Product.findByPk(id);
    Checker.ifEmptyThrowError(product, Constants.Error.ProductNotFound);
    return product
  },

  retrieveAllProduct: async() => {
    return await Product.findAll();
  },

  retrieveProductByCategoryId: async(categoryId) => {
    Checker.ifEmptyThrowError(categoryId, 'Category ' + Constants.Error.IdRequired);
    return await Product.findAll({
      where: {
        categoryId
      }
    });
  },

  retrieveProductByMerchantId: async(merchantId) => {
    Checker.ifEmptyThrowError(merchantId, 'Merchant ' + Constants.Error.IdRequired);
    return await Product.findAll({
      where: {
        merchantId
      }
    });
  }
}
