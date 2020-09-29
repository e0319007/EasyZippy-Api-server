const sequelize = require('../common/database');
const { sendErrorResponse } = require('../common/error/errorHandler');

module.exports = {
  createLockerType: async(req, res) => {
    try {
      
      return res.status(200).send();
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  updateLockerType: async(req, res) => {
    try {
 
      return res.status(200).send();
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveLockerType: async(req, res) => {
    try {
 
      return res.status(200).send();
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveAllLockerTypes: async(req, res) => {
    try {
 
      return res.status(200).send();
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  disableLockerType: async(req, res) => {
    try {
 
      return res.status(200).send();
    } catch(err) {
      sendErrorResponse(res, err);
    }
  },

  deleteLockerType: async(req, res) => {
    try {
 
      return res.status(200).send();
    } catch(err) {
      sendErrorResponse(res, err);
    }
  }
}