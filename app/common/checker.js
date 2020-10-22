const _ = require('lodash');
const Constants = require('./constants');
const CustomError = require('./error/customError');

const isEmpty = (object) => {
  if (_.isNull(object) || _.isUndefined(object) || typeof object === 'undefined' || object === '' || object === 'undefined') {
    return true;
  } else if (_.isArray(object) && object.length === 0) {
    return true;
  }
  return false;
};

module.exports = {
  isEmpty,
  ifEmptyThrowError: (object, errorMessage) => {
    if (isEmpty(object)) {
      throw new CustomError(errorMessage);
    }
  },
  ifNotNumberThrowError: (object, errorMessage) => {
    if(isNaN(object)) {
      throw new CustomError(errorMessage);
    }
  },
  ifNegativeThrowError: (object, errorMessage) => {
    if(!isNaN(object) && object < 0) {
      throw new CustomError(errorMessage);
    }
  },
  ifDeletedThrowError: (object, errorMessage) => {
    if(_.isUndefined(object.deleted) || !_.isBoolean(object.deleted)) {
      throw new Error(Constants.Error.CheckerCalledInappropriately)
    }
    if(object.deleted) {
      throw new CustomError(errorMessage);
    }
  }
};