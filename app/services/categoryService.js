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
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    const category = await Category.findByPk(id);
    Checker.ifEmptyThrowError(category, Constants.Error.CategoryNotFound);
    Checker.ifDeletedThrowError(category, Constants.Error.CategoryDeleted);

    return category;
  },

  retrieveAllCategory: async() => {
    const categories = await Category.findAll({where: { deleted: false } });
    return categories;
  },

  updateCategory: async(id, categoryData, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let category = await Category.findByPk(id);
    Checker.ifEmptyThrowError(category, Constants.Error.CategoryNotFound);
    Checker.ifDeletedThrowError(category, Constants.Error.CategoryDeleted);

    const updateKeys = Object.keys(categoryData);
    if(updateKeys.includes('name')) {
      Checker.ifEmptyThrowError(Constants.Error.NameRequired);
      const c = await Category.findOne({ where : { name: categoryData.name } });
      if(!Checker.isEmpty(c) && !c.deleted && c.id != id) {
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
    if(!Checker.isEmpty(await category.getProducts())) throw new CustomError(Constants.Error.CategoryCannotBeDeleted);
    await Category.update({
      deleted: true
    }, { where: { id }, transaction });
  }
}