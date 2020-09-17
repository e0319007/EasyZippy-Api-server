const { sendErrorResponse } = require('../common/error/errorHandler');
const MerchantService = require('../services/merchantService');

module.exports = {
  preUploadCheck: async (req, res, next) => {
    try {
      const { id } = req.params;
      const file = req.files[0];

      await MerchantService.preUploadCheck(id, file);

      return next();
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
};