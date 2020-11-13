const sequelize = require('../common/database');
const ExternalPaymentRecordService = require('../services/externalPaymentRecordService');
const { sendErrorResponse } = require('../common/error/errorHandler');

module.exports = {
  createExternalPaymentRecordMerchantTopUp: async(req, res) => {
    try {
      const { merchantId } = req.params;
        const { externalId, amount } = req.body;
        let externalPaymentRecord;
        await sequelize.transaction(async (transaction) => {
          externalPaymentRecord = await ExternalPaymentRecordService.createExternalPaymentRecordMerchantTopUp(merchantId, externalId, amount, transaction);
        });
        return res.status(200).send(externalPaymentRecord);
    } catch(err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  }
}
