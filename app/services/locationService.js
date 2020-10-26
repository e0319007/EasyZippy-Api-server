const Checker = require("../common/checker");
const Constants = require('../common/constants');

const Location = require("../models/Location");

module.exports = {
  createLocation: async(locationData, transaction) => {
    let { name, address, postalCode } = locationData;
    Checker.ifEmptyThrowError(name, Constants.Error.NameRequired);
    Checker.ifEmptyThrowError(address, 'Address ' + Constants.Error.XXXIsRequired);
    Checker.ifEmptyThrowError(postalCode, 'Postal code ' + Constants.Error.XXXIsRequired);

    return await Location.create(locationData, { transaction });
  },

  retrieveLocationById: async(id) => {
    const location = await Location.findByPk(id);
    Checker.ifEmptyThrowError(location, Constants.Error.LocationNotFound);
    Checker.ifDeletedThrowError(location, Constants.Error.LocationDeleted);
    return location;
  },

  retrieveAllLocations: async() => {
    return await Location.findAll({ where: { deleted: false } });
  },

  retrieveAllLocationsWithoutDisabled: async() => {
    return await Location.findAll({ where: { deleted: false, disabled: false } });
  },

  updateLocation: async(id, locationData, transaction) => {
    let location = await Location.findByPk(id);
    Checker.ifEmptyThrowError(location, Constants.Error.LocationNotFound);

    const updateKeys = Object.keys(locationData);

    if(updateKeys.includes('name')) {
      Checker.ifEmptyThrowError(locationData.name, Constants.Error.NameRequired);
    }
    if(updateKeys.includes('address')) {
      Checker.ifEmptyThrowError(locationData.address, 'Address ' + Constants.Error.XXXIsRequired);
    }
    if(updateKeys.includes('postalCode')) {
      Checker.ifEmptyThrowError(locationData.postalCode, 'Postal code ' + Constants.Error.XXXIsRequired);
    }
    
    location = awlocationlocationlocationate(locationData, { returning: true, transaction });
    return location;
  },

  toggleDisableLocation: async(id, transaction) => {
    let location = await Location.findByPk(id);
    Checker.ifEmptyThrowError(location, Constants.Error.LocationNotFound);
    Checker.ifDeletedThrowError(location, Constants.Error.LocationNotFound);

    return await location.update({ disabled: location.disabled }, { transaction });
  },

  deleteLocation: async(id, transaction) => {
    let location = await Location.findByPk(id);
    Checker.ifEmptyThrowError(location, Constants.Error.LocationNotFound);

    await location.update({ deleted: true }, { transaction });
  },
};