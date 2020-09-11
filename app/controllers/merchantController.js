const sequelize = require('../common/database');
const MerchantService = require('../services/merchantService');
const { sendErrorResponse } = require('../common/error/errorHandler');

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
  }
};