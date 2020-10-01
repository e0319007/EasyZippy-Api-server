const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');

const LockerType = require('../models/LockerType');


module.exports = {
  createLockerType: async(lockerTypeData, transaction) => {
    let { name, height, width, length, price } = lockerTypeData;
    Checker.ifEmptyThrowError(name, Constants.Error.NameRequired);
    Checker.ifEmptyThrowError(height, 'Height ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(width, 'Width ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(length, 'Length ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(price, 'Price '  + Constants.Error.XXXIsRequired);
    if (height < 0) {
      throw new CustomError('Height ' + Constants.Error.CannotBeNegative);
    }
    if (width < 0) {
      throw new CustomError('Width ' + Constants.Error.CannotBeNegative);
    }
    if (length < 0) {
      throw new CustomError('Length ' + Constants.Error.CannotBeNegative);
    }
    if (price < 0) {
      throw new CustomError('Price ' + Constants.Error.CannotBeNegative);
    }
    name = name.toLowerCase();
    if (await LockerType.findOne({ where: { name } })) {
      throw new CustomError(Constants.Error.NameNotUnique);
    }
    const lockerType = await LockerType.create(lockerTypeData, { transaction });
    return lockerType;
  },

  updateLockerType: async(id, lockerTypeData, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let lockerType = await LockerType.findByPk(id);
    Checker.ifEmptyThrowError(lockerType, Constants.Error.LockerTypeNotFound);
    const updateKeys = Object.keys(lockerTypeData);

    if(updateKeys.includes('width') && width < 0) {
      throw new CustomError('Width ' + Constants.Error.CannotBeNegative);
    }
    if(updateKeys.includes('height') && height < 0) {
      throw new CustomError('Height ' + Constants.Error.CannotBeNegative);
    }
    if(updateKeys.includes('length') && length < 0) {
      throw new CustomError('Length ' + Constants.Error.CannotBeNegative);
    }
    if(updateKeys.includes('price') && price < 0) {
      throw new CustomError('Price ' + Constants.Error.CannotBeNegative);
    }
    if(updateKeys.includes('name')) {
      lockerTypeData.name = lockerTypeData.name.toLowerCase();
      if (await LockerType.findOne({ where: { name } })) {
        throw new CustomError(Constants.Error.NameNotUnique);
      }
    }
    lockerType = await lockerType.update(lockerTypeData, { returning: true, transaction })
  },

  retrieveLockerType: async(id) => {
    const lockerType = await LockerType.findByPk(id);
    Checker.ifEmptyThrowError(lockerType, Constants.Error.LockerTypeNotFound);
    return lockerType;
  },

  retrieveAllLockerType: async() => {
    const lockerType = await LockerType.findAll();
    return lockerType;
  },

  toggleDisableLockerType: async(id, transaction) => {
    const curLockerType = await LockerType.findByPk(id);
    Checker.ifEmptyThrowError(curLockerType, Constants.Error.LockerTypeNotFound)
    console.log(curLockerType.disabled);
    let lockerType = await LockerType.update({
      disabled: !curLockerType.disabled
    }, {
      where: {
        id
      }, returning: true, transaction });
    return lockerType;
  },

  deleteLockerType: async(id) => {
    const lockerType = await LockerType.findByPk(id);
    Checker.ifEmptyThrowError(LockerType, Constants.Error.LockerTypeNotFound);
    await LockerType.destroy({
      where: {
        id
      }
    });
  }
}