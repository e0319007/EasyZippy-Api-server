const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');
const lockerTypeController = require('../controllers/lockerTypeController');
const BookingPackageModel = require('../models/BookingPackageModel');
const Locker = require('../models/Locker');
const LockerType = require('../models/LockerType');

module.exports = {
  createBookingPackageModel: async(bookingPackageModelData, transaction) => {
    const { name, description, quota, price, duration, lockerTypeId } = bookingPackageModelData;
    Checker.ifEmptyThrowError(name, Constants.Error.NameRequired);
    Checker.ifEmptyThrowError(quota, 'Quota ' + Constants.Error.XXXIsRequired);
    Checker.ifNotNumberThrowError(quota, 'Quota ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNegativeThrowError(quota, 'Quota ' + Constants.Error.XXXCannotBeNegative);  
    Checker.ifEmptyThrowError(price, 'Price ' + Constants.Error.XXXIsRequired);
    Checker.ifNotNumberThrowError(price, 'Price ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNegativeThrowError(price, 'Price ' + Constants.Error.XXXCannotBeNegative);  
    Checker.ifEmptyThrowError(duration, 'Duration ' + Constants.Error.XXXIsRequired);
    Checker.ifNotNumberThrowError(duration, 'Duration ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNegativeThrowError(duration, 'Duration ' + Constants.Error.XXXCannotBeNegative);
    Checker.ifEmptyThrowError(lockerTypeId, 'Locker type id ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(await LockerType.findByPk(lockerTypeId), Constants.Error.LockerTypeNotFound);

    const bookingPackageModel = await BookingPackageModel.create(bookingPackageModelData, { transaction });
    return bookingPackageModel;
  },

  updateBookingPackageModel: async(id, bookingPackageModelData, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let bookingPackageModel = await BookingPackageModel.findByPk(id);
    Checker.ifEmptyThrowError(bookingPackageModel, Constants.Error.BookingPackageModelNotFound);
    Checker.ifDeletedThrowError(bookingPackageModel, Constants.Error.BookingPackageModelDeleted);

    const updateKeys = Object.keys(bookingPackageModelData);
    if(updateKeys.includes('name')) {
      Checker.ifEmptyThrowError(bookingPackageModelData.name, Constants.Error.NameRequired);
    }
    if(updateKeys.includes('quota')) {
      Checker.ifEmptyThrowError(bookingPackageModelData.quota, 'Quota ' + Constants.Error.XXXIsRequired);
      Checker.ifNotNumberThrowError(bookingPackageModelData.quota, 'Quota ' + Constants.Error.XXXMustBeNumber);  
      Checker.ifNegativeThrowError(bookingPackageModelData.quota, 'Quota ' + Constants.Error.XXXCannotBeNegative);  
    }
    if(updateKeys.includes('price')) {
      Checker.ifEmptyThrowError(bookingPackageModelData.price, 'Price ' + Constants.Error.XXXIsRequired);
      Checker.ifNotNumberThrowError(bookingPackageModelData.price, 'Price ' + Constants.Error.XXXMustBeNumber);  
      Checker.ifNegativeThrowError(bookingPackageModelData.price, 'Price ' + Constants.Error.XXXCannotBeNegative);  
    }
    if(updateKeys.includes('duration')) {
      Checker.ifEmptyThrowError(bookingPackageModelData.duration, 'Duration ' + Constants.Error.XXXIsRequired);
      Checker.ifNotNumberThrowError(bookingPackageModelData.duration, 'Duration ' + Constants.Error.XXXMustBeNumber);  
      Checker.ifNegativeThrowError(bookingPackageModelData.duration, 'Duration ' + Constants.Error.XXXCannotBeNegative);  
    }
    if(updateKeys.includes('lockerTypeId')) {
      Checker.ifEmptyThrowError(bookingPackageModelData.lockerTypeId, 'Locker type id ' + Constants.Error.XXXIsRequired);
      Checker.ifEmptyThrowError(await LockerType.findByPk(bookingPackageModelData.lockerTypeId), Constants.Error.LockerTypeNotFound);  
    }

    bookingPackageModel = await BookingPackageModel.update(bookingPackageModelData, { where : { id }, returning: true, transaction });
    return bookingPackageModel;
  },

  toggleDisableBookingPackageModel: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let curBpm = await BookingPackageModel.findByPk(id);
    Checker.ifEmptyThrowError(curBpm, Constants.Error.BookingPackageModelNotFound);
    Checker.ifDeletedThrowError(curBpm, Constants.Error.BookingPackageModelDeleted);

    let bookingPackageModel = await BookingPackageModel.update({
      disabled: !curBpm.disabled
    }, {
      where: {
        id
      }, returning: true, transaction });
      return bookingPackageModel;
  },

  retrieveAllBookingPackageModel: async() => {
    return await BookingPackageModel.findAll({ where: { deleted: false } });
  },

  retrieveBookingPackageModel: async(id) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let bookingPackageModel = await BookingPackageModel.findByPk(id);
    Checker.ifEmptyThrowError(bookingPackageModel, Constants.Error.BookingPackageModelNotFound);
    Checker.ifDeletedThrowError(bookingPackageModel, Constants.Error.BookingPackageModelDeleted);

    return bookingPackageModel;
  },

  retrieveBookingPackageModelsByKioskId: async(kioskId) => {
    Checker.ifEmptyThrowError(kioskId, Constants.Error.IdRequired);
    let bookingPackageModels = new Array();
    let lockers = await Locker.findAll({ where: { kioskId } });
    let lockerTypeIds = new Array();
    for(let l of lockers) {
      lockerTypeIds.push(l.lockerTypeId);
    }
    let uniqueLockerTypeIds = [...new Set(lockerTypeIds)];
    for(let lockerTypeId of uniqueLockerTypeIds) {
      let bookingPackageModel = await BookingPackageModel.findAll({ where: { lockerTypeId } });
      bookingPackageModels = bookingPackageModels.concat(bookingPackageModel);
    }
    return bookingPackageModels;
  },

  deleteBookingPackageModel: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let bookingPackageModel = await BookingPackageModel.findByPk(id);
    Checker.ifEmptyThrowError(bookingPackageModel, Constants.Error.BookingPackageModelNotFound);
    Checker.ifDeletedThrowError(bookingPackageModel, Constants.Error.BookingPackageModelDeleted);
    if(!Checker.isEmpty(await bookingPackageModel.getBookingPackages())) throw new CustomError(Constants.Error.BookingPackageModelCannotBeDeleted);
    await BookingPackageModel.update({ deleted: true }, { where: { id }, transaction });
  },
}