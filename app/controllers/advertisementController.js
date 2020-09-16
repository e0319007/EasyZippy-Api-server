const sequelize = require('../common/database');
const { sendErrorResponse } = require('../common/error/errorHandler');
const AdvertisementService = require('../services/advertisementService');

module.exports = {
  createAdvertisementAsStaff: async(req, res) => {
    try {  
      const advertisementData = req.body;
      let advertisement;
      await sequelize.transaction(async (transaction) => {
        advertisement = await AdvertisementService.createAdvertisementAsStaff(advertisementData, transaction)
      });
      return res.status(200).send(advertisement);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  createAdvertisementAsMerchant: async(req, res) => {
    try {  
      const advertisementData = req.body;
      let advertisement;
      await sequelize.transaction(async (transaction) => {
        advertisement = await AdvertisementService.createAdvertisementAsMerchant(advertisementData, transaction)
      });
      return res.status(200).send(advertisement);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  createAdvertisementAsMerchantWithoutAccount: async(req, res) => {
    try {  
      let advertisement;      
      const advertisementData = req.body;
      await sequelize.transaction(async (transaction) => {
        advertisement = await AdvertisementService.createAdvertisementAsMerchantWithoutAccount(advertisementData, transaction)
      });
      return res.status(200).send(advertisement);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveAdvertisementById: async(req, res) => {
    try {  
      const { id } = req.params;
      let advertisement = AdvertisementService.retrieveAdvertisementById(id);
      return res.status(200).send(advertisement);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveAdvertisementByMerchantId: async(req, res) => {
    try {  
      const { merchantId } = req.params;
      let advertisements = AdvertisementService.retrieveAdvertisementByMerchantId(merchantId);
      return res.status(200).send(advertisements);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveAdvertisementByStaffId: async(req, res) => {
    try {  
      const { staffId } = req.params;
      let advertisements = AdvertisementService.retrieveAdvertisementByStaffId(staffId);
      return res.status(200).send(advertisements);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveAllAdvertisement: async(req, res) => {
    let advertisements = AdvertisementService.retrieveAllAdvertisement();
    try {  
      return res.status(200).send(advertisements);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  updateAdvertisement: async(req, res) => {
    try {  
      const { id } = req.params;
      const advertisementData = req.body;
      let advertisement;
      await sequelize.transaction(async (transaction) => {
        advertisement = AdvertisementService.updateAdvertisement(id, advertisementData, transaction)
      });
      return res.status(200).send(advertisement);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  toggleApproveAdvertisement: async(req, res) => {
    try {  
      let advertisement;
      const { id } = req.params;
      await sequelize.transaction(async (transaction) => {
        advertisement = AdvertisementService.toggleApproveAdvertisement(id, transaction);
      });
      return res.status(200).send(advertisement);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  setExpireAdvertisement: async(req, res) => {
    try {  
      const { id } = req.params;
      let advertisement;
      await sequelize.transaction(async (transaction) => {
        advertisement = AdvertisementService.setExpireAdvertisement(id, transaction);
      });
      return res.status(200).send(advertisement);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  deleteAdvertisement: async(req, res) => {
    try {  
      const { id } = req.params;
      AdvertisementService.deleteAdvertisement(id);
      return res.status(200).send();
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },
}