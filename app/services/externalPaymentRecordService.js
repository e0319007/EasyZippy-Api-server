const { payment } = require("paypal-rest-sdk");
const Checker = require("../common/checker");
const Constants = require('../common/constants');

const ExternalPaymentRecord = require('../models/ExternalPaymentRecord');

module.exports = {
  createExternalPaymentRecord: async(payload, transaction) => {
    console.log('arrived')
    console.log(payload)
    const externalId = payload.id;
    const amount = payload.transactions[0].amount.total;

    Checker.ifEmptyThrowError(payload, Constants.Error.PayloadRequired);
    Checker.ifEmptyThrowError(externalId, Constants.Error.PaymentIdRequired);
    Checker.ifEmptyThrowError(amount, Constants.Error.AmountRequired);

    const externalPaymentRecord = await ExternalPaymentRecord.create({ externalId, amount, payload, paymentTypeEnum: Constants.PaymentType.Paypal }, { transaction });

    return externalPaymentRecord;
  }
};