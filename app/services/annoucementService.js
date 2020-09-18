const Checker = require("../common/checker");
const Constants = require('../common/constants');
const CustomError = require("../common/error/customError");

const Announcement = require('../models/Announcement');

module.exports = {
  createAnnouncement: async(announcementData, transaction) => {
    const { description, sentTime } = announcementData;
    Checker.ifEmptyThrowError(title, Constants.Error.Title);
    const announcement = await Announcement.create(announcementData, { transaction });
    return announcement;
  },

  retrieveAnnouncement: async(id) => {
    let announcement = await Announcement.findByPk(id);
    Checker.ifEmptyThrowError(announcement, Constants.Error.AnnouncementNotFound);
    return announcement;
  },

  retrieveAllAnnouncement: async() => {
    return await Announcement.findAll();
  },

  updateAnnouncement: async(id, announcementData, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let announcement = await Announcement.findByPk(id);
    Checker.ifEmptyThrowError(announcement, Constants.Error.AnnouncementNotFound);

    const updateKeys = Object.keys(announcementData);
    if(updateKeys.includes('title')) {
      Checker.ifEmptyThrowError(Constants.Error.AnnouncementNotFound);
    }

    announcement = await announcement.update(announcementData, { returning: true, transaction});
    return announcement
  },

  deleteAnnouncement: async(id) => {
    //check if announcement is sent. Cannot delete sent announcement
    const announcement = await Announcement.findByPk(id);
    Checker.ifEmptyThrowError(announcement, Constants.Error.AnnouncementNotFound);
    if(announcement.sentTime > Date.now) {
      await Announcement.destroy({ where: { id } });
    } else {
      throw new CustomError(Constants.Error.AnnouncementCannotBeDeleted);
    }
  }

}