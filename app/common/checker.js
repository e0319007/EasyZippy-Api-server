const _ = require('lodash');
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
  }
};