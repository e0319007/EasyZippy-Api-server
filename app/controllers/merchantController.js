const sequelize = require('../common/database');
const MerchantService = require('../services/merchantService');
const { sendErrorResponse } = require('../common/error/errorHandler');
const merchantService = require('../services/merchantService');

module.exports = {
  registerMerchant: async (req, res) => {
    try {
      const merchantData = req.body;
      let merchant;

      await sequelize.transaction(async (transaction) => {
        merchant = await MerchantService.createMerchant(merchantData, transaction);
      });

      return res.status(200).send(merchant);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveMerchant: async(req, res) => {
    try {
      const { id } = req.params;
      let merchant = await MerchantService.retrieveMerchant(id);
      return res.status(200).send(merchant);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveAllMerchants: async(req, res) => {
    try {
      let merchants = await MerchantService.retrieveAllMerchants();
      return res.status(200).send(merchants);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  updateMerchant: async(req, res) => {
    try {
      const merchantData = req.body;
      const { id } = req.params;
      let merchant;
      await sequelize.transaction(async(transaction) => {
        merchant = await merchantService.updateMerchant(id, merchantData, transaction);
      })
      return res.status(200).send(merchant);
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  },

  toggleDisableMerchant: async(req, res) => {
    try {
      const { id } = req.params;
      let merchant;
      await sequelize.transaction(async(transaction) => {
        merchant = await MerchantService.toggleDisableMerchant(id, transaction);
      })
      return res.status(200).send(merchant);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  approveMerchant: async(req, res) => {
    try {
      const { id } = req.params;
      let merchant;
      await sequelize.transaction(async(transaction) => {
        merchant = await MerchantService.approveMerchant(id, transaction);
      })
      return res.status(200).send(merchant);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  loginMerchant: async (req, res) => {
    try {
      const { email, password } = req.body;

      const { merchant, token } = await MerchantService.loginMerchant(email, password);

      return res.status(200).send({ merchant, token });
    } catch (err) {
      sendErrorResponse(res, err, 401);
    }
  },

  changePassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword, currentPassword } = req.body;
      let merchant;
      await sequelize.transaction(async (transaction) => {
        merchant = await MerchantService.changePassword(id, newPassword, currentPassword, transaction)
      });
      return res.status(200).send(merchant);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  uploadTenancyAgreement: async (req, res) => {
    try {
      const { id } = req.params;
      const images = req.files;
      await sequelize.transaction(async (transaction) => {
        await MerchantService.uploadTenancyAgreement(id, images[0], transaction);
      });
      return res.status(200).send();
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
};