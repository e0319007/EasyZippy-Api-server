const CustomError = require('./customError');

module.exports = {
  sendErrorResponse: (res, err, errorCode = 400) => {
    if (err instanceof CustomError) {
      return res.status(errorCode).send(err.message);
    }
    return res.status(500).send();
  }
};