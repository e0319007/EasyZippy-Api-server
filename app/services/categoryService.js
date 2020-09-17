const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');

const Category = require('../models/Category');

module.exports = {
  createCategory: async(categoryData, transaction) => {
    const { name } = categoryData;
    Checker.ifEmptyThrowError(name, Constants.Error.NameRequired);
    if(!Checker.isEmpty(await Category.findOne({ where : { name } }))) {
      throw new CustomError(Constants.Error.NameNotUnique);
    }
    const category = await Category.create(categoryData, { transaction })
    return category;
  },

  retrieveCategory: async(id) => {
    const category = await Category.findByPk(id);

    Checker.ifEmptyThrowError(category, Constants.Error.CategoryNotFound);
    return category;
  },

  retrieveAllCategory: async() => {
    const categories = Category.findAll();
    return categories;
  },

  updateCategory: async(id, categoryData, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let category = await Category.findByPk(id);
    Checker.ifEmptyThrowError(category, Constants.Error.CategoryNotFound);
    const updateKeys = Object.keys(categoryData);
    if(updateKeys.includes('name')) {
        Checker.ifEmptyThrowError(Constants.Error.NameRequired);
    }
    category = Category.update(
      categoryData,
      { returning: true, transaction, 
        where : {
          id
        }
    });

    return category;
  },

  deleteCategory: async(id) => {
    // To check for associated products
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let category = await Category.findByPk(id);
    Checker.ifEmptyThrowError(category, Constants.Error.CategoryNotFound);
    Category.destroy({ where: { id } });
  }
}