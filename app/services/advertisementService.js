const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');
const moment = require('moment')

const Advertisement = require('../models/Advertisement');
const Merchant = require('../models/Merchant');
const Staff = require('../models/Staff');
const Kiosk = require('../models/Kiosk');

module.exports = {
  createAdvertisementAsStaff: async(advertisementData, transaction) => {
    const {title, description, imageUrl, startDate, endDate, amountPaid, advertiserMobile, advertiserEmail, staffId} = advertisementData;
    if(startDate > endDate) {
      throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    }
    Checker.ifEmptyThrowError(title, Constants.Error.AdvertisementTitleRequired);
    Checker.ifEmptyThrowError(startDate, Constants.Error.AdvertisementStartDateRequired);
    Checker.ifEmptyThrowError(endDate, Constants.Error.AdvertisementEndDateRequired);
    Checker.ifEmptyThrowError(await Staff.findByPk(staffId), Constants.Error.StaffNotFound);
    const advertisement = await Advertisement.create({
      title, description, imageUrl, startDate, endDate, amountPaid, advertiserMobile, advertiserEmail, staffId
    }, { transaction });
    return advertisement;
  },

  createAdvertisementAsMerchant: async(advertisementData, transaction) => {
    const {title, description, imageUrl, startDate, endDate, amountPaid, advertiserMobile, advertiserEmail, merchantId} = advertisementData;
    if(startDate > endDate) {
      throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    }
    Checker.ifEmptyThrowError(title, Constants.Error.AdvertisementTitleRequired);
    Checker.ifEmptyThrowError(startDate, Constants.Error.AdvertisementStartDateRequired);
    Checker.ifEmptyThrowError(endDate, Constants.Error.AdvertisementEndDateRequired);
    let merchant = Merchant.findByPk(merchantId);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);
    if (Checker.isEmpty(advertiserEmail)) {
      advertiserEmail = merchant.email;
    }
    if (Checker.isEmpty(advertiserMobile)) {
      advertiserMobile = merchant.mobileNumber;
    }
    const advertisement = await Advertisement.create({
      advertisementData
    }, { transaction });
    return advertisement;
  },

  createAdvertisementAsMerchantWithoutAccount: async(advertisementData, transaction) => {
    const {title, description, imageUrl, startDate, endDate, amountPaid, advertiserMobile, advertiserEmail} = advertisementData;
    if(startDate > endDate) {
      throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    }
    Checker.ifEmptyThrowError(title, Constants.Error.AdvertisementTitleRequired);
    Checker.ifEmptyThrowError(startDate, Constants.Error.AdvertisementStartDateRequired);
    Checker.ifEmptyThrowError(endDate, Constants.Error.AdvertisementEndDateRequired);
    Checker.ifEmptyThrowError(advertiserMobile, Constants.Error.AdvertiserMobileRequired);
    Checker.ifEmptyThrowError(advertiserEmail, Constants.Error.AdvertiserEmailRequired);
    const advertisement = await Advertisement.create({
      advertisementData
    }, { transaction });
    return advertisement;
  },

  retrieveAdvertisementById: async(id) => {
    const advertisement = await Advertisement.findByPk(id);
    Checker.ifEmptyThrowError(advertisement, Constants.Error.AdvertisementNotFound);
    return advertisement;
  },

  retrieveAdvertisementByMerchantId: async(merchantId) => {
    const advertisements = await Advertisement.findAll({
      where: {
        merchantId
      }
    });
    return advertisements;
  },
  
  retrieveAdvertisementByStaffId: async(staffId) => {
    const advertisements = await Advertisement.findAll({
      where: {
        staffId
      }
    });
    return advertisements;
  },

  retrieveAllAdvertisement: async() => {
    return await Advertisement.findAll();
  },

  updateAdvertisement: async(id, advertisementData, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let advertisement = Advertisement.findOne(id);
    Checker.ifEmptyThrowError(advertisement, Constants.Error.AdvertisementNotFound);

    const updateKeys = Object.keys(advertisementData);

    if(updateKeys.includes('title')) {
      Checker.ifEmptyThrowError(title, Constants.Error.AdvertisementTitleRequired);
    }
    if(updateKeys.includes('startDate')) {
      Checker.ifEmptyThrowError(startDate, Constants.Error.AdvertisementStartDateRequired);
    }
    if(updateKeys.includes('endDate')) {
      Checker.ifEmptyThrowError(endDate, Constants.Error.AdvertisementEndDateRequired);
    }
    if(updateKeys.includes('startDate' && updateKeys.includes('endDaate'))) {
      if(startDate > endDate) {
        throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
      }
    }
    if(Checker.isEmpty(advertisement.staffId)) {
      if(updateKeys.includes('advertiserMobile')) {
        Checker.ifEmptyThrowError(endDate, Constants.Error.AdvertiserMobileRequired);
      }
      if(updateKeys.includes('advertiserEmail')) {
        Checker.ifEmptyThrowError(endDate, Constants.Error.AdvertiserEmailRequired);
      }
    }
    advertisement = await Advertisement.update(advertisement, { where : { id }, returning: true, transaction });
    return advertisement;
  },

  toggleApproveAdvertisement: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let curAdvertisement = Advertisement.findOne(id);
    Checker.ifEmptyThrowError(curAdvertisement, Constants.Error.AdvertisementNotFound);
    
    let curDateTime = moment();
    if(curAdvertisement.expired || curDateTime > curAdvertisement.startDate) {
      throw new CustomError(Constants.Error.AdvertisementExpired);
    }
    let advertisement = await Advertisement.update({
      approved: !curAdvertisement.approved
    }, {
      where: {
        id
      }, returning: true, transaction });
      return advertisement;
  },

  setExpireAdvertisement: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let curAdvertisement = Advertisement.findOne(id);
    Checker.ifEmptyThrowError(curAdvertisement, Constants.Error.AdvertisementNotFound);
    
    let curDateTime = moment();
    if(curAdvertisement.approved && curDateTime < curAdvertisement.endDate) {
      if(curDateTime > curAdvertisement.startDate) {
        throw new CustomError('Cannot mark expire an ongoing advertisement')
      } else {
        throw new CustomError('Cannot mark expire an advertisement waiting to be advertised')
      }
    }

    let advertisement = await Advertisement.update({
      expired: true
    }, {
      where: {
        id
      }, returning: true, transaction });
      return advertisement;
  },

  deleteAdvertisement: async(id) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    const advertisement= Advertisement.findByPk(id);
    Checker.ifEmptyThrowError(advertisement, Constants.Error.AdvertisementNotFound);
    Kiosk.destroy({
      where: {
        id
      }
    });
  },
}