const { sendErrorResponse } = require('../common/error/errorHandler');
const sequelize = require('../common/database');

const AnnouncementService = require('../services/annoucementService');

module.exports = {
  createAnnouncement: async(req, res) => {
    try {
      const announcementData = req.body;
      let announcement;
      await sequelize.transaction(async (transaction) => {
        announcement = await AnnouncementService.createAnnouncement(announcementData, transaction)
      });
      return res.status(200).send(announcement);
    } catch {
      sendErrorResponse(res, err);
    }
  },

  retrieveAnnouncement: async(req, res) => {
    try {
      const { id } = req.params;
      let announcement = await AnnouncementService.createAnnouncement(id);
      return res.status(200).send(announcement);
    } catch {
      sendErrorResponse(res, err);
    }
  },

  retrieveAllAnnouncement: async(req, res) => {
    try {
      return res.status(200).send(await AnnouncementService.retrieveAllAnnouncement());
    } catch {
      sendErrorResponse(res, err);
    }
  },

  updateAnnouncement: async(req, res) => {
    try {
      const { id } = req.params;
      const announcementData = req.body;
      let announcement;
      await sequelize.transaction(async (transaction) => {
        announcement = await AnnouncementService.updateAnnouncement(id, announcementData, transaction)
      });
      return res.status(200).send(announcement);
    } catch {
      sendErrorResponse(res, err);
    }
  },

  deleteAnnouncement: async(req, res) => {
    try {
      const { id } = req.params;
      await AnnouncementService.deleteAnnouncement(id);
      return res.status(200).send();
    } catch {
      sendErrorResponse(res, err);
    }
  }
}