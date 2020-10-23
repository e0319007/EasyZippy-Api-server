const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');
const CreditPaymentRecord = require('../models/CreditPaymentRecord');

const Customer = require('../models/Customer')
const Merchant = require('../models/Merchant')

module.exports = {
  payCreditCustomer: async(customerId, amountPaid, transaction) => {
    amountPaid = parseFloat(amountPaid);
    Checker.ifEmptyThrowError(customerId, Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXIsRequired);
    Checker.ifNotNumberThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNegativeThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXCannotBeNegative);

    let customer = await Customer.findByPk(customerId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);
    if (amountPaid <= customer.creditBalance) {
      let newCreditAmount = customer.creditBalance -  amountPaid;
      await customer.update({ creditBalance: newCreditAmount }, { transaction });
    } else throw new CustomError(Constants.Error.InsufficientCreditBalance);
    
    let creditPaymentRecord = await CreditPaymentRecord.create({ amount: 0 - amountPaid, customerId }, { transaction });

    return creditPaymentRecord;
  },

  refundCreditCustomer: async(customerId, amountPaid, transaction) => {
    amountPaid = parseFloat(amountPaid);
    Checker.ifEmptyThrowError(customerId, Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXIsRequired);
    Checker.ifNotNumberThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNegativeThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXCannotBeNegative);

    let customer = await Customer.findByPk(customerId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);
    await customer.update({ creditBalance: Number(customer.creditBalance) + Number(amountPaid) }, { transaction });
    let creditPaymentRecord = await CreditPaymentRecord.create({ amount: amountPaid, customerId }, { transaction });

    return creditPaymentRecord;
  },

  payCreditMerchant: async(merchantId, amountPaid, transaction) => {
    amountPaid = parseFloat(amountPaid);
    Checker.ifEmptyThrowError(merchantId, Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXIsRequired);
    Checker.ifNotNumberThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNegativeThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXCannotBeNegative);

    let merchant = await Merchant.findByPk(merchantId);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);
    if (amountPaid <= merchant.creditBalance) {
      let newCreditAmount = merchant.creditBalance -  amountPaid;
      await merchant.update({ creditBalance: newCreditAmount }, { transaction });
    } else throw new CustomError(Constants.Error.InsufficientCreditBalance);

    let creditPaymentRecord = await CreditPaymentRecord.create({ amount: 0 - amountPaid, merchantId }, { transaction });

    return creditPaymentRecord;
  },

  refundCreditMerchant: async(merchantId, amountPaid, transaction) => {
    amountPaid = parseFloat(amountPaid);
    Checker.ifEmptyThrowError(merchantId, Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXIsRequired);
    Checker.ifNotNumberThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNegativeThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXCannotBeNegative);

    let merchant = await Merchant.findByPk(merchantId);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);
    await merchant.update({ creditBalance: Number(merchant.creditBalance) + Number(amountPaid) }, { transaction });
    
    let creditPaymentRecord = await CreditPaymentRecord.create({ amount: amountPaid, merchantId }, { transaction });

    return creditPaymentRecord;
  },
};