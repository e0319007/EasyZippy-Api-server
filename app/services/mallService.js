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
    return mall;
  }
};