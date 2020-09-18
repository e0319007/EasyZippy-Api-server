const { sendErrorResponse } = require('../common/error/errorHandler');
const sequelize = require('../common/database');

const AnnounceService = require('../services/annoucementService');

module.exports = {
  createAnnouncement: async(req, res) => {
    try {

    } catch {
      sendErrorResponse(res, err);
    }
  },

  retrieveAnnouncement: async(req, res) => {
    try {

    } catch {
      sendErrorResponse(res, err);
    }
  },

  retrieveAllAnnouncement: async(req, res) => {
    try {

    } catch {
      sendErrorResponse(res, err);
    }
  },

  updateAnnouncement: async(req, res) => {
    try {

    } catch {
      sendErrorResponse(res, err);
    }
  },

  deleteAnnouncement: async(req, res) => {
    try {

    } catch {
      sendErrorResponse(res, err);
    }
  }
}