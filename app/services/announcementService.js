const Checker = require("../common/checker");
const Constants = require('../common/constants');
const CustomError = require("../common/error/customError");

const Announcement = require('../models/Announcement');
const Staff = require("../models/Staff");

module.exports = {
  createAnnouncement: async(announcementData, transaction) => {
    const { title, description, staffId } = announcementData;
    Checker.ifEmptyThrowError(title, Constants.Error.TitleRequired);
    Checker.ifEmptyThrowError(staffId, 'Staff ' + Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(await Staff.findByPk(staffId), Constants.Error.StaffNotFound);

    announcementData.sentTime = new Date();
    
    const announcement = await Announcement.create(announcementData, { transaction });
    return announcement;
  },

  retrieveAnnouncement: async(id) => {
    let announcement = await Announcement.findByPk(id);
    Checker.ifEmptyThrowError(announcement, Constants.Error.AnnouncementNotFound);
    return announcement;
  },

  retrieveAnnouncementByStaffId: async(staffId) => {
    Checker.ifEmptyThrowError(staffId, 'Staff ' + Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(await Staff.findByPk(staffId), Constants.Error.StaffNotFound);
    return await Announcement.findAll({ where: { staffId } });
  },

  retrieveAllAnnouncement: async() => {
    return await Announcement.findAll();
  },

  retrieveLatestAnnouncement: async() => {
    return await Announcement.findOne({
      order: [ [ 'createdAt', 'DESC' ]],
    });
  },

  retrieveLatestAnnouncementByLimit: async(count) => {
    return await Announcement.findAll({
      limit: count,
      order: [ [ 'createdAt', 'DESC' ]],
    });
  },

  updateAnnouncement: async(id, announcementData, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let announcement = await Announcement.findByPk(id);
    Checker.ifEmptyThrowError(announcement, Constants.Error.AnnouncementNotFound);

    const updateKeys = Object.keys(announcementData);
    if(updateKeys.includes('title')) {
      Checker.ifEmptyThrowError(announcementData.title, Constants.Error.TitleRequired);
    }

    announcement = await announcement.update(announcementData, { returning: true, transaction});
    return announcement
  },

  deleteAnnouncement: async(id) => {
    //check if announcement is sent. Cannot delete sent announcement
    const announcement = await Announcement.findByPk(id);
    Checker.ifEmptyThrowError(announcement, Constants.Error.AnnouncementNotFound);
    let then = Date.parse(announcement.sentTime);
    let now = new Date().valueOf();
    console.log('then:'+ then)
    console.log('now :'+ now)

    if(then > now) {
      await Announcement.destroy({ where: { id } });
    } else {
      throw new CustomError(Constants.Error.AnnouncementCannotBeDeleted);
    }
  }

}