const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');
const moment = require('moment');
const fs = require('fs-extra');

const Advertisement = require('../models/Advertisement');
const Merchant = require('../models/Merchant');
const Staff = require('../models/Staff');


module.exports = {
  createAdvertisementAsStaff: async(advertisementData, transaction) => {
    let {title, description, image, advertiserUrl, startDate, endDate, amountPaid, advertiserMobile, advertiserEmail, staffId} = advertisementData;
    if(startDate > endDate) {
      throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    }
    Checker.ifEmptyThrowError(title, Constants.Error.AdvertisementTitleRequired);
    Checker.ifEmptyThrowError(startDate, Constants.Error.AdvertisementStartDateRequired);
    Checker.ifEmptyThrowError(endDate, Constants.Error.AdvertisementEndDateRequired);
    Checker.ifEmptyThrowError(await Staff.findByPk(staffId), Constants.Error.StaffNotFound);
    Checker.ifEmptyThrowError(image, Constants.Error.ImageRequired);
    const advertisement = await Advertisement.create({
      title, description, imageUrl, startDate, endDate, amountPaid, advertiserMobile, advertiserEmail, staffId
    }, { transaction });
    return advertisement;
  },

  createAdvertisementAsMerchant: async(advertisementData, transaction) => {
    let {title, description, image, advertiserUrl, startDate, endDate, amountPaid, advertiserMobile, advertiserEmail, merchantId} = advertisementData;
    if(startDate > endDate) {
      throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    }
    Checker.ifEmptyThrowError(title, Constants.Error.AdvertisementTitleRequired);
    Checker.ifEmptyThrowError(startDate, Constants.Error.AdvertisementStartDateRequired);
    Checker.ifEmptyThrowError(endDate, Constants.Error.AdvertisementEndDateRequired);    
    Checker.ifEmptyThrowError(image, Constants.Error.ImageRequired);

    let merchant = await Merchant.findByPk(merchantId);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);
    console.log("merchant info: " + merchant)
    if (Checker.isEmpty(advertiserEmail)) {
      console.log("merchant.email: " + merchant.email);
      advertisementData.advertiserEmail = merchant.email;
    }
    if (Checker.isEmpty(advertiserMobile)) {
      advertisementData.advertiserMobile = merchant.mobileNumber;
    }
    const advertisement = await Advertisement.create(
      advertisementData
    , { transaction });
    return advertisement;
  },

  createAdvertisementAsMerchantWithoutAccount: async(advertisementData, transaction) => {
    let {title, description, image, advertiserUrl, startDate, endDate, amountPaid, advertiserMobile, advertiserEmail} = advertisementData;
    if(startDate > endDate) {
      throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
    }
    Checker.ifEmptyThrowError(title, Constants.Error.AdvertisementTitleRequired);
    Checker.ifEmptyThrowError(startDate, Constants.Error.AdvertisementStartDateRequired);
    Checker.ifEmptyThrowError(endDate, Constants.Error.AdvertisementEndDateRequired);
    Checker.ifEmptyThrowError(advertiserMobile, Constants.Error.AdvertiserMobileRequired);
    Checker.ifEmptyThrowError(advertiserEmail, Constants.Error.AdvertiserEmailRequired);
    Checker.ifEmptyThrowError(image, Constants.Error.ImageRequired);
    const advertisement = await Advertisement.create(
      advertisementData
    , { transaction });
    return advertisement;
  },

  retrieveAdvertisementById: async(id) => {
    const advertisement = await Advertisement.findByPk(id);
    Checker.ifEmptyThrowError(advertisement, Constants.Error.AdvertisementNotFound);
    if(advertisement.deleted) {
      throw new CustomError(Constants.Error.AdvertisementDeleted);
    }
    
    return advertisement;
  },

  retrieveAdvertisementByMerchantId: async(merchantId) => {
    const advertisements = await Advertisement.findAll({
      where: {
        merchantId,
        deleted: false
      }
    });
    return advertisements;
  },
  
  retrieveAdvertisementByStaffId: async(staffId) => {
    const advertisements = await Advertisement.findAll({
      where: {
        staffId,
        deleted: false
      }
    });
    return advertisements;
  },

  retrieveAllAdvertisement: async() => {
    return await Advertisement.findAll({ where: { deleted: false } });
  },

  //retrieve advertisemnt that can be shown
  retrieveOngoingAdvertisement: async() => {
    console.log(new Date())
    let advertisments = await Advertisement.findAll({
      where: {
        deleted: false,
        approved: true,
        expired: false,
        // $or: [
        //   {
        //     startDate: { 
        //       $gte: new Date(), 
        //     },
        //   },{
        //     endDate: { 
        //       $lte: new Date(),
        //     }
        //   }
        // ]
      }
    })
    return advertisments;
  },

  updateAdvertisement: async(id, advertisementData, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let advertisement = await Advertisement.findByPk(id);
    Checker.ifEmptyThrowError(advertisement, Constants.Error.AdvertisementNotFound);
    if(advertisement.deleted) {
      throw new CustomError(Constants.Error.AdvertisementDeleted);
    }

    const updateKeys = Object.keys(advertisementData);

    if(updateKeys.includes('title')) {
      Checker.ifEmptyThrowError(advertisementData.title, Constants.Error.AdvertisementTitleRequired);
    }
    if(updateKeys.includes('startDate')) {
      Checker.ifEmptyThrowError(advertisementData.startDate, Constants.Error.AdvertisementStartDateRequired);
    }
    if(updateKeys.includes('endDate')) {
      Checker.ifEmptyThrowError(advertisementData.endDate, Constants.Error.AdvertisementEndDateRequired);
    }
    if(updateKeys.includes('startDate') && updateKeys.includes('endDate')) {
      if(advertisementData.startDate > advertisementData.endDate) {
        throw new CustomError(Constants.Error.StartDateLaterThanEndDate);
      }
    }
    if(Checker.isEmpty(advertisement.staffId)) {
      console.log("advertisement is not a staff advertisement")
      if(updateKeys.includes('advertiserMobile')) {
        Checker.ifEmptyThrowError(advertisementData.advertiserMobile, Constants.Error.AdvertiserMobileRequired);
      }
      if(updateKeys.includes('advertiserEmail')) {
        Checker.ifEmptyThrowError(advertisementData.advertiserEmail, Constants.Error.AdvertiserEmailRequired);
      }
    }
    if(updateKeys.includes('amountPaid')) {
      Checker.ifNotNumberThrowError(advertisementData.amountPaid, 'Amount paid ' + Constants.Error.XXXMustBeNumber);
      if (advertisementData.amountPaid < 0) {
        throw new CustomError('Amount paid ' + Constants.Error.XXXCannotBeNegative);
      }
    }
    if(updateKeys.includes('image')) {
      Checker.ifEmptyThrowError(advertisementData.image, Constants.Error.ImageRequired);
      console.log(advertisement.image)
      fs.remove(advertisement.image);
    }
    advertisement = await Advertisement.update(advertisementData, { where : { id }, returning: true, transaction });
    return advertisement;
  },

  toggleApproveAdvertisement: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let curAdvertisement = await Advertisement.findByPk(id);
    if(curAdvertisement.deleted) {
      throw new CustomError(Constants.Error.AdvertisementDeleted);
    }
    Checker.ifEmptyThrowError(curAdvertisement, Constants.Error.AdvertisementNotFound);
    
    let curDateTime = new Date();

    console.log(curAdvertisement.approved)
    
    //dont approve when advertisement has been mark as expired or when the start date of advertisement has passed
    if(!curAdvertisement.approved && (curAdvertisement.expired || curDateTime > curAdvertisement.startDate)) {
      console.log("current Date time: " + curDateTime)
      console.log("start time: " + curAdvertisement.startDate)
      throw new CustomError(Constants.Error.AdvertisementExpired);
    }

    //dont disapprove when advertisment is approved and showing at the same time
    if(curAdvertisement.approved && (curDateTime > curAdvertisement.startDate && curDateTime < curAdvertisement.endDate)) {
      throw new CustomError(Constants.Error.AdvertisementDisapproveError);
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
    let curAdvertisement = await Advertisement.findByPk(id);
    Checker.ifEmptyThrowError(curAdvertisement, Constants.Error.AdvertisementNotFound);
    if(curAdvertisement.deleted) {
      throw new CustomError(Constants.Error.AdvertisementDeleted);
    }
    
    let curDateTime = new Date();
    if(curAdvertisement.approved && curDateTime < curAdvertisement.endDate) {
      if(curDateTime > curAdvertisement.startDate) {
        throw new CustomError(Constants.Error.AdvertisementOngoingCannotMarkExpire);
      } else {
        throw new CustomError(Constants.Error.AdvertisementApprovedCannotMarkExpire);
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

  toggleDisableAdvertisement: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let advertisement = await Advertisement.findByPk(id);
    if(advertisement.deleted) {
      throw new CustomError(Constants.Error.AdvertisementDeleted);
    }
    if(advertisement.approved) {
      throw new CustomError(Constants.Error.AdvertisementApprovedCannotDelete);
    }
    Checker.ifEmptyThrowError(advertisement, Constants.Error.AdvertisementNotFound);
    let ad = Advertisement.update({
      disabled : !advertisement.disabled
    },{
      where: {
        id
      }, transaction
    });
    return ad;
  },

  deleteAdvertisement: async(id, transaction) => {
    Checker.ifEmptyThrowError(id, Constants.Error.IdRequired);
    let advertisement = await Advertisement.findByPk(id);
    Checker.ifEmptyThrowError(advertisement, Constants.Error.AdvertisementNotFound);
    await Advertisement.update({
      deleted : true
    },{
      where: {
        id
      }, transaction
    });
  },
}
