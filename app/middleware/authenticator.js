const { sendErrorResponse } = require('../common/error/errorHandler');
const Constants = require('../common/constants');
const AuthService = require('../services/authService');

module.exports = {
  customerOnly: async (req, res, next) => {
    try {
      const token = req.header('AuthToken');
      if (await AuthService.customerOnly(token)) {
        return next();
      }
      return res.status(401).send(Constants.Error.AccessDenied);
    } catch (err) {
      sendErrorResponse(res, err, 401);
    }
  },

  merchantOnly: async (req, res, next) => {
    try {
      const token = req.header('AuthToken');
      if (await AuthService.merchantOnly(token)) {
        return next();
      }
      return res.status(401).send(Constants.Error.AccessDenied);
    } catch (err) {
      sendErrorResponse(res, err, 401);
    }
  },

  staffOnly: async (req, res, next) => {
    try {
      const token = req.header('AuthToken');
      if (await AuthService.staffOnly(token)) {
        return next();
      }
      return res.status(401).send(Constants.Error.AccessDenied);
    } catch (err) {
      sendErrorResponse(res, err, 401);
    }
  },

  customerOnly: async (req, res, next) => {
    try {
      const token = req.header('AuthToken');
      if (await AuthService.customerOnly(token)) {
        return next();
      }
      return res.status(401).send(Constants.Error.AccessDenied);
    } catch (err) {
      sendErrorResponse(res, err, 401);
    }
  },

  customerAndMerchantOnly: async (req, res, next) => {
    try {
      const token = req.header('AuthToken');
      if (await AuthService.customerAndMerchantOnly(token)) {
        return next();
      }
      return res.status(401).send(Constants.Error.AccessDenied);
    } catch (err) {
      sendErrorResponse(res, err, 401);
    }
  },

  customerAndStaffOnly: async (req, res, next) => {
    try {
      const token = req.header('AuthToken');
      if (await AuthService.customerAndStaffOnly(token)) {
        return next();
      }
      return res.status(401).send(Constants.Error.AccessDenied);
    } catch (err) {
      sendErrorResponse(res, err, 401);
    }
  },

  merchantAndStaffOnly: async (req, res, next) => {
    try {
      const token = req.header('AuthToken');
      if (await AuthService.merchantAndStaffOnly(token)) {
        return next();
      }
      return res.status(401).send(Constants.Error.AccessDenied);
    } catch (err) {
      sendErrorResponse(res, err, 401);
    }
  },

  customerAndMerchantAndStaffOnly: async (req, res, next) => {
    try {
      const token = req.header('AuthToken');
      if (await AuthService.customerAndMerchantAndStaffOnly(token)) {
        return next();
      }
      return res.status(401).send(Constants.Error.AccessDenied);
    } catch (err) {
      sendErrorResponse(res, err, 401);
    }
  }
};