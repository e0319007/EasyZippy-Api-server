const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');

const Category = require('../models/Category');

module.exports = {
  createCategory: async(categoryData, transaction) => {
    const { name } = categoryData;
    Checker.ifEmptyThrowError(name, Constants.Error.NameRequired);
    const c = await Category.findOne({ where : { name } });
    if(!Checker.isEmpty(c) && !c.deleted) {
      throw new CustomError(Constants.Error.NameNotUnique);
    }
    const category = await Category.create(categoryData, { transaction })
    return category;
  },

  retrieveCategory: async(id) => {
    const category = await Category.findByPk(id);
    if(category.deleted) {
      throw new CustomError(Constants.Error.CategoryDeleted);
    }

    Checker.ifEmptyThrowError(category, Constants.Error.CategoryNotFound);
    return category;
  },

  retrieveAllCategory: async() => {
    const categories = Category.findAll({where: { deleted: false } });
    return categories;
  },

  updateCategory: async(id, categoryData, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let category = await Category.findByPk(id);
    Checker.ifEmptyThrowError(category, Constants.Error.CategoryNotFound);
    if(category.deleted) {
      throw new CustomError(Constants.Error.CategoryDeleted);
    }

    const updateKeys = Object.keys(categoryData);
    if(updateKeys.includes('name')) {
      Checker.ifEmptyThrowError(Constants.Error.NameRequired);
      const c = await Category.findOne({ where : { name } });
      if(!Checker.isEmpty(c) && !c.deleted) {
        throw new CustomError(Constants.Error.NameNotUnique);
      }
    }
    category = await Category.update(
      categoryData,
      { returning: true, transaction, 
        where : {
          id
        }
    });

    return category;
  },

  deleteCategory: async(id, transaction) => {
    // To check for associated products
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let category = await Category.findByPk(id);
    Checker.ifEmptyThrowError(category, Constants.Error.CategoryNotFound);
    await Category.update({
      deleted: true
    }, { where: { id }, transaction });
  }
}