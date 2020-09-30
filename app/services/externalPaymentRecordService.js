const { payment } = require("paypal-rest-sdk");
const Checker = require("../common/checker");
const Constants = require('../common/constants');
const Customer = require('../models/Customer');

const ExternalPaymentRecord = require('../models/ExternalPaymentRecord');
const { customerAndMerchantAndStaffOnly } = require("./authService");

module.exports = {
  createExternalPaymentRecord: async(customerId, payload, transaction) => {
    console.log('arrived')
    console.log(payload)
    const externalId = payload.id;
    const amount = payload.transactions[0].amount.total;
    const customer = await Customer.findByPk(customer);

    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);
    Checker.ifEmptyThrowError(payload, Constants.Error.PayloadRequired);
    Checker.ifEmptyThrowError(externalId, Constants.Error.PaymentIdRequired);
    Checker.ifEmptyThrowError(amount, Constants.Error.AmountRequired);

    const externalPaymentRecord = await ExternalPaymentRecord.create({ externalId, amount, payload, paymentTypeEnum: Constants.PaymentType.Paypal, customerId }, { transaction });

    return externalPaymentRecord;
  }
};