const { sendErrorResponse } = require('../common/error/errorHandler');
const { preUploadCheck } = require('../services/merchantService');
const MerchantService = require('../services/merchantService');
const Constants = require('../common/constants')
const Checker = require('../common/checker')
const fs = require('fs-extra');
const CustomError = require('../common/error/customError');

module.exports = {
  preUploadCheck: async (req, res, next) => {
    try {
      const { id } = req.params;
      const file = req.files[0];

      await MerchantService.preUploadCheck(id, file);

      return next();
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  preUploadCheckForImg: async (req, res, next) => {
    try {
      const file = req.files[0];

      Checker.ifEmptyThrowError(file, Constants.Error.FileRequired);
      if (file.filename.slice(-4) !== '.png' && file.filename.slice(-4) !== '.jpg' && file.filename.slice(-5) !== '.jpeg') {
        fs.remove(`./app/assets/${file.filename}`);
        throw new CustomError(Constants.Error.ImageRequired);
      }
      return next();
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  preUploadCheckForOptionalImg: async (req, res, next) => {
    try {
      const file = req.files[0];

      if (Checker.isEmpty(file)) return next();

      if (file.filename.slice(-4) !== '.png' && file.filename.slice(-4) !== '.jpg' && file.filename.slice(-5) !== '.jpeg') {
        fs.remove(`./app/assets/${file.filename}`);
        throw new CustomError(Constants.Error.ImageRequired);
      }
      return next();
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  }
};