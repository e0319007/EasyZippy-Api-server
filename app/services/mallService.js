const Checker = require("../common/checker");
const Constants = require('../common/constants');

const Mall = require("../models/Mall");

module.exports = {
  createMall: async(mallData, transaction) => {
    let { name, address, postalCode } = mallData;
    Checker.ifEmptyThrowError(name, Constants.Error.NameRequired);
    Checker.ifEmptyThrowError(address, 'Address ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(postalCode, 'Postal code ' + Constants.Error.XXXIsRequired);

    return await Mall.create(mallData, { transaction });
  },

  retrieveMallById: async(id) => {
    const mall = await Mall.findByPk(id);
    Checker.ifEmptyThrowError(mall, Constants.Error.MallNotFound);
    Checker.ifDeletedThrowError(mall, Constants.Error.MallDeleted);
    return mall;
  },

  retrieveAllMalls: async() => {
    return await Mall.findAll({ where: { deleted: false } });
  },

  updateMall: async(id, mallData, transaction) => {
    let mall = await Mall.findByPk(id);
    Checker.ifEmptyThrowError(mall, Constants.Error.MallNotFound);

    const updateKeys = Object.keys(mallData);

    if(updateKeys.includes('name')) {
      Checker.ifEmptyThrowError(mallData.name, Constants.Error.NameRequired);
    }
    if(updateKeys.includes('address')) {
      Checker.ifEmptyThrowError(mallData.address, 'Address ' + Constants.Error.XXXIsRequired);
    }
    if(updateKeys.includes('postalCode')) {
      Checker.ifEmptyThrowError(mallData.postalCode, 'Postal code ' + Constants.Error.XXXIsRequired);
    }
    
    mall = await mall.update(mallData, { returning: true, transaction });
    return mall;
  },

  toggleDisableMall: async(id, transaction) => {
    const mall = await Mall.findByPk(id);
    Checker.ifEmptyThrowError(mall, Constants.Error.MallNotFound);
    Checker.ifDeletedThrowError(mall, Constants.Error.MallNotFound);

    return await mall.update({ disabled: !mall.disabled }, { transaction });
  },

  deleteMall: async(id, transaction) => {
    const mall = await Mall.findByPk(id);
    Checker.ifEmptyThrowError(mall, Constants.Error.MallNotFound);

    await mall.update({ deleted: true }, { transaction });
  },
};