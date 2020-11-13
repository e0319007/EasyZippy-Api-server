const sequelize = require('../common/database');
const CreditPaymentRecordService = require('../services/creditPaymentRecordService');
const { sendErrorResponse } = require('../common/error/errorHandler');

module.exports = {
  retrieveCreditPaymentRecordByCustomerId: async(req, res) => {
    try {
      const { customerId } = req.params;
      res.status(200).send(await CreditPaymentRecordService.retrieveCreditPaymentRecordByCustomerId(customerId));
    } catch(err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  },

  retrieveCreditPaymentRecordByMerchantId: async(req, res) => {
    try {
      const { merchantId } = req.params;
      res.status(200).send(await CreditPaymentRecordService.retrieveCreditPaymentRecordByMerchantId(merchantId));
    } catch(err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  },

  retrieveAllCreditPaymentRecordsOfCustomer: async(req, res) => {
    try {
      res.status(200).send(await CreditPaymentRecordService.retrieveAllCreditPaymentRecordsOfCustomer());
    } catch(err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  },

  retrieveAllCreditPaymentRecordsOfMerchant: async(req, res) => {
    try {
      res.status(200).send(await CreditPaymentRecordService.retrieveAllCreditPaymentRecordsOfMerchant());
    } catch(err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  },

  retrieveAllCreditPaymentRecords: async(req, res) => {
    try {
      res.status(200).send(await CreditPaymentRecordService.retrieveAllCreditPaymentRecords());
    } catch(err) {
      console.log(err);
      sendErrorResponse(res, err);
    }
  },
}
