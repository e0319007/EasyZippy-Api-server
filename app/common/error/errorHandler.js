const CustomError = require('./customError');
const Constants = require('../constants');

module.exports = {
  sendErrorResponse: (res, err, errorCode = 400) => {
    if (err instanceof CustomError) {
      return res.status(errorCode).send(err.message);
    }
    return res.status(500).send(Constants.Error.UnexpectedError);
  }
};