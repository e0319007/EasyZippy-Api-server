const Checker = require("../common/checker");
const Constants = require('../common/constants');
const CustomError = require("../common/error/customError");

const ExternalPaymentRecord = require('../models/ExternalPaymentRecord');

module.exports = {
  createExternalPaymentRecord: async(payload, transaction) => {
    const externalId = payload.id;
    const amount = payment.transactions[0].amount.total;

    Checker.ifEmptyThrowError(payload, Constants.Error.PayloadRequired);
  }
};