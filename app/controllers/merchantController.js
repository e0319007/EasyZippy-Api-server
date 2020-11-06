const sequelize = require('../common/database');
const MerchantService = require('../services/merchantService');
const { sendErrorResponse } = require('../common/error/errorHandler');
const NotificationHelper = require('../common/notificationHelper');
const EmailHelper = require('../common/emailHelper');

module.exports = {
  registerMerchant: async (req, res) => {
    let merchantLogoImage = req.body.merchantLogoImage;
    try {
      const merchantData = req.body;
      let merchant;

      await sequelize.transaction(async (transaction) => {
        merchant = await MerchantService.createMerchant(merchantData, transaction);
      });

      await NotificationHelper.notificationNewApplication(merchant.id);
      return res.status(200).send(merchant);
    } catch (err) {
      fs.remove(merchantLogoImage);
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  retrieveMerchant: async(req, res) => {
    try {
      const { id } = req.params;
      const merchant = await MerchantService.retrieveMerchant(id);
      return res.status(200).send(merchant);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveMerchantByEmail: async(req, res) => {
    try {
      const { email } = req.body;
      const merchant = await MerchantService.retrieveMerchantByEmail(email);
      return res.status(200).send(merchant);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveMerchantByProductVariationId: async(req, res) => {
    try {
      const { productVariationId } = req.params;
      const merchant = await MerchantService.retrieveMerchantByProductVariationId(productVariationId);
      return res.status(200).send(merchant);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  retrieveMerchantByPromotionId: async(req, res) => {
    try {
      const { promotionId } = req.params;
      const merchant = await MerchantService.retrieveMerchantByPromotionId(promotionId);
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
        merchant = await MerchantService.updateMerchant(id, merchantData, transaction);
      })
      return res.status(200).send(merchant);
    } catch (err) {
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
      });
      if(merchant[1][0].dataValues.approved) {
        await EmailHelper.sendEmailForMerchantApproval(merchant[1][0].dataValues.email);
        await NotificationHelper.notificationAccountApproval(merchant[1][0].dataValues.id, transaction);
      } else {
        await EmailHelper.sendEmailForMerchantDisapproval(merchant[1][0].dataValues.email);
        await NotificationHelper.notificationAccountDisapproval(merchant[1][0].dataValues.id, transaction);}
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
      const fileName = req.files[0].filename;
      let merchant;

      await sequelize.transaction(async (transaction) => {
        merchant = await MerchantService.uploadTenancyAgreement(id, fileName, transaction);
      });
      return res.status(200).send(merchant);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  sendResetPasswordEmail: async (req, res) => {
    try {
      const { email } = req.body;
      await MerchantService.sendResetPasswordEmail(email);
      return res.status(200).send();
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  checkValidToken: async (req, res) => {
    try {
      const { email, token } = req.body;
      await MerchantService.checkValidToken(token, email);
      return res.status(200).send();
    } catch(err) {
      console.log(err)
      sendErrorResponse(res, err);
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { email, token, newPassword } = req.body;
      let merchant;
      await sequelize.transaction(async (transaction) => {
        merchant = await MerchantService.resetPassword(email, token, newPassword, transaction);
      });
      return res.status(200).send(merchant);
    } catch (err) {
      sendErrorResponse(res, err);
    }
  },

  uploadImageForMerchantLogoPreRegister: async(req, res) => {
    let merchantLogoImage = req.files[0].filename;
    try {
      return res.status(200).send(merchantLogoImage);
    } catch (err) {
      fs.remove(merchantLogoImage);
      console.log(err);
      sendErrorResponse(res, err);
    }
  },

  addImageForMerchantLogo: async (req, res) => {
    try {
      let merchant;
      let { id } = req.params;
      await sequelize.transaction(async (transaction) => {
        merchant = await MerchantService.addImageForMerchantLogo(id, req.files[0].filename, transaction);
      });
      return res.status(200).send(merchant);
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  },

  changeImageForMerchantLogo: async (req, res) => {
    try {
      let merchant;
      let { id } = req.params;
      await sequelize.transaction(async (transaction) => {
        merchant = await MerchantService.changeImageForMerchantLogo(id, req.files[0].filename, transaction);
      });
      return res.status(200).send(merchant);    
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  },

  removeImageForMerchantLogo: async (req, res) => {
    try {
      let merchant;
      let { id } = req.params;
      await sequelize.transaction(async (transaction) => {
        merchant = await MerchantService.removeImageForMerchantLogo(id, transaction);
      });
      return res.status(200).send(merchant);    
    } catch (err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  },
};