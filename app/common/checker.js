const _ = require('lodash');
const CustomError = require('./error/customError');

module.exports = {
  isEmpty: (object) => {
    if (_.isNull(object) || _.isUndefined(object) || typeof object === 'undefined' || object === '' || object === 'undefined') {
      return true;
    } else if (_.isArray(object) && object.length === 0) {
      return true;
    }
    return false;
  },

  ifEmptyThrowError: (object, errorMessage) => {
    if (IsEmpty(object)) {
      throw new CustomError(errorMessage);
    }
  }
};