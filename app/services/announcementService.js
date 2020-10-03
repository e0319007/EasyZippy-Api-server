const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');

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
    if(announcement.deleted) {
      throw new CustomError(Constants.Error.AnnouncementDeleted);
    }
    return announcement;
  },

  retrieveAnnouncementByStaffId: async(staffId) => {
    Checker.ifEmptyThrowError(staffId, 'Staff ' + Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(await Staff.findByPk(staffId), Constants.Error.StaffNotFound);
    return await Announcement.findAll({ where: { staffId, deleted: false } });
  },

  retrieveAllAnnouncement: async() => {
    return await Announcement.findAll({ where: { deleted: false } });
  },

  retrieveLatestAnnouncement: async() => {
    return await Announcement.findOne({ where: { deleted: false } }, {
      order: [ [ 'createdAt', 'DESC' ]],
    });
  },

  retrieveLatestAnnouncementByLimit: async(count) => {
    return await Announcement.findAll({ where: { deleted: false } }, {
      limit: count,
      order: [ [ 'createdAt', 'DESC' ]],
    });
  },

  updateAnnouncement: async(id, announcementData, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let announcement = await Announcement.findByPk(id);
    Checker.ifEmptyThrowError(announcement, Constants.Error.AnnouncementNotFound);
    if(announcement.deleted) {
      throw new CustomError(Constants.Error.AnnouncementDeleted);
    }
    const updateKeys = Object.keys(announcementData);
    if(updateKeys.includes('title')) {
      Checker.ifEmptyThrowError(announcementData.title, Constants.Error.TitleRequired);
    }

    announcement = await announcement.update(announcementData, { returning: true, transaction});
    return announcement
  },

  deleteAnnouncement: async(id, transaction) => {
    //check if announcement is sent. Cannot delete sent announcement
    const announcement = await Announcement.findByPk(id);
    Checker.ifEmptyThrowError(announcement, Constants.Error.AnnouncementNotFound);
    let then = Date.parse(announcement.sentTime);
    let now = new Date().valueOf();
    console.log('then:'+ then)
    console.log('now :'+ now)

    if(then > now) {
      await Announcement.update({ deleted: true }, { where: { id }, transaction });
    } else {
      throw new CustomError(Constants.Error.AnnouncementCannotBeDeleted);
    }
  }

}