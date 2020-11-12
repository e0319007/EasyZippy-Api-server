const Checker = require("../common/checker");
const Constants = require('../common/constants');
const Customer = require('../models/Customer');
const Merchant = require("../models/Merchant");

const ExternalPaymentRecord = require('../models/ExternalPaymentRecord');
const CreditPaymentRecordService = require("./creditPaymentRecordService");

module.exports = {
  createExternalPaymentRecordCustomerTopUp: async(customerId, payload, transaction) => {
    const externalId = payload.id;
    const amount = payload.transactions[0].amount.total;
    const customer = await Customer.findByPk(customerId);

    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);
    Checker.ifEmptyThrowError(payload, Constants.Error.PayloadRequired);
    Checker.ifEmptyThrowError(externalId, Constants.Error.PaymentIdRequired);
    Checker.ifEmptyThrowError(amount, Constants.Error.AmountRequired);

    const externalPaymentRecord = await ExternalPaymentRecord.create({ externalId, amount, payload, paymentTypeEnum: Constants.PaymentType.PAYPAL, customerId }, { transaction });

    await CreditPaymentRecordService.refundCreditCustomer(customerId, amount, Constants.CreditPaymentType.TOP_UP, transaction);

    return externalPaymentRecord;
  },

  createExternalPaymentRecordMerchantTopUp: async(merchantId, externalId, amount, transaction) => {
    const merchant = await Merchant.findByPk(merchantId);

    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);
    Checker.ifEmptyThrowError(externalId, Constants.Error.PaymentIdRequired);
    Checker.ifEmptyThrowError(amount, Constants.Error.AmountRequired);

    const externalPaymentRecord = await ExternalPaymentRecord.create({ externalId, amount, paymentTypeEnum: Constants.PaymentType.Paypal, merchantId }, { transaction });

    await CreditPaymentRecordService.refundCreditMerchant(merchantId, amount, Constants.CreditPaymentType.TOP_UP, transaction);

    return externalPaymentRecord;
  }
};