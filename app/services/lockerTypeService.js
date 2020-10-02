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
    Checker.ifNotNumberThrowError(lockerTypeData.width, 'Width ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNotNumberThrowError(lockerTypeData.height, 'Height ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNotNumberThrowError(lockerTypeData.length, 'Length ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNotNumberThrowError(lockerTypeData.price, 'Price ' + Constants.Error.XXXMustBeNumber);
    if (height < 0) {
      throw new CustomError('Height ' + Constants.Error.XXXCannotBeNegative);
    }
    if (width < 0) {
      throw new CustomError('Width ' + Constants.Error.XXXCannotBeNegative);
    }
    if (length < 0) {
      throw new CustomError('Length ' + Constants.Error.XXXCannotBeNegative);
    }
    if (price < 0) {
      throw new CustomError('Price ' + Constants.Error.XXXCannotBeNegative);
    }

    name = name.toLowerCase();
    if (!Checker.isEmpty(await LockerType.findOne({ where: { name } }))) {
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

    if(updateKeys.includes('width') && lockerTypeData.width < 0) {
      throw new CustomError('Width ' + Constants.Error.XXXCannotBeNegative);
    }
    if(updateKeys.includes('height') && lockerTypeData.height < 0) {
      throw new CustomError('Height ' + Constants.Error.XXXCannotBeNegative);
    }
    if(updateKeys.includes('length') && lockerTypeData.length < 0) {
      throw new CustomError('Length ' + Constants.Error.XXXCannotBeNegative);
    }
    if(updateKeys.includes('price') && lockerTypeData.price < 0) {
      throw new CustomError('Price ' + Constants.Error.XXXCannotBeNegative);
    }
    if(updateKeys.includes('name')) {
      let name = lockerTypeData.name.toLowerCase();
      const lockerTypeWithName = await LockerType.findOne({ where: { name } })
      if (!Checker.isEmpty(lockerTypeWithName) && lockerTypeWithName.id !== parseInt(id)) {
        throw new CustomError(Constants.Error.NameNotUnique);
      }
    }
    Checker.ifNotNumberThrowError(lockerTypeData.width, 'Width ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNotNumberThrowError(lockerTypeData.height, 'Height ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNotNumberThrowError(lockerTypeData.length, 'Length ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNotNumberThrowError(lockerTypeData.price, 'Price ' + Constants.Error.XXXMustBeNumber);

    lockerType = await lockerType.update(lockerTypeData, { returning: true, transaction })
    return lockerType;
  },

  retrieveLockerType: async(id) => {
    const lockerType = await LockerType.findByPk(id);
    Checker.ifEmptyThrowError(lockerType, Constants.Error.LockerTypeNotFound);
    return lockerType;
  },

  retrieveAllLockerType: async() => {
    const lockerTypes = await LockerType.findAll();
    return lockerTypes;
  },

  toggleDisableLockerType: async(id, transaction) => {
    const curLockerType = await LockerType.findByPk(id);
    Checker.ifEmptyThrowError(curLockerType, Constants.Error.LockerTypeNotFound)
    let lockerType = await LockerType.update({
      disabled: !curLockerType.disabled
    }, {
      where: {
        id
      }, returning: true, transaction });
    return lockerType;
  },

  deleteLockerType: async(id) => {
    // To check for associated lockers
    const lockerType = await LockerType.findByPk(id);
    Checker.ifEmptyThrowError(LockerType, Constants.Error.LockerTypeNotFound);
    await LockerType.destroy({
      where: {
        id
      }
    });
  }
}
