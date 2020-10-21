const { sendErrorResponse } = require('../common/error/errorHandler');
const sequelize = require('../common/database');

const AnnouncementService = require('../services/announcementService');
const {
  subscribeDeviceToAnnouncementsTopic,
  sendMessageToAnnouncementsTopic,
} = require("../firebase/messaging");

module.exports = {
  createAnnouncement: async(req, res) => {
    try {
      const announcementData = req.body;
      let announcement;
      await sequelize.transaction(async (transaction) => {
        announcement = await AnnouncementService.createAnnouncement(announcementData, transaction)
      });
      sendMessageToAnnouncementsTopic(announcementData.title, announcementData.description);
      return res.status(200).send(announcement);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveAnnouncement: async(req, res) => {
    try {
      const { id } = req.params;
      let announcement = await AnnouncementService.retrieveAnnouncement(id);
      return res.status(200).send(announcement);
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveAnnouncementByStaffId: async(req, res) => {
    try {
      let { staffId } = req.params;
      return res.status(200).send(await AnnouncementService.retrieveAnnouncementByStaffId(staffId));
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveAllAnnouncement: async(req, res) => {
    try {
      return res.status(200).send(await AnnouncementService.retrieveAllAnnouncement());
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveLatestAnnouncement: async(req, res) => {
    try {
      return res.status(200).send(await AnnouncementService.retrieveLatestAnnouncement());
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveLatestAnnouncementByLimit: async(req, res) => {
    try {
      const { count } = req.params;
      return res.status(200).send(await AnnouncementService.retrieveLatestAnnouncementByLimit(count));
    } catch (err) {
      console.log(err)
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
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  deleteAnnouncement: async(req, res) => {
    try {
      const { id } = req.params;
      await sequelize.transaction(async (transaction) => {
        await AnnouncementService.deleteAnnouncement(id, transaction);
      });
      return res.status(200).send();
    } catch (err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  subscribeDeviceToAnnouncements: async (req, res) => {
    try {
      const { registrationToken } = req.body;
      subscribeDeviceToAnnouncementsTopic(registrationToken);
        return res.status(200).send();
    } catch (err) {
        sendErrorResponse(res, err);
    }
  },
}