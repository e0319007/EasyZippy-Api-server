const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');
const CreditPaymentRecord = require('../models/CreditPaymentRecord');

const Customer = require('../models/Customer')
const Merchant = require('../models/Merchant')

module.exports = {
  payCreditCustomer: async(customerId, amountPaid, creditPaymentTypeEnum, transaction) => {
    amountPaid = parseFloat(amountPaid);
    Checker.ifEmptyThrowError(customerId, Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXIsRequired);
    Checker.ifNotNumberThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNegativeThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXCannotBeNegative);
    let customer = await Customer.findByPk(customerId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);
    
    let referralCreditMarker = customer.referralCreditMarker;
    let referralCreditUsed = 0;

    if(creditPaymentTypeEnum === Constants.CreditPaymentType.Booking) {
      if (amountPaid > customer.creditBalance) throw new CustomError(Constants.Error.InsufficientCreditBalance);
      if(referralCreditMarker - amountPaid >= 0) {
        referralCreditUsed = amountPaid;
        referralCreditMarker -= amountPaid;
      } else {
        referralCreditUsed = referralCreditMarker;
        referralCreditMarker = 0;
      }

    } else {
      if (amountPaid > customer.creditBalance - referralCreditMarker) throw new CustomError(Constants.Error.InsufficientCreditBalance);
    }

    let newCreditAmount = customer.creditBalance -  amountPaid;
    await customer.update({ creditBalance: newCreditAmount, referralCreditMarker }, { transaction });
    let creditPaymentRecord = await CreditPaymentRecord.create({ amount: 0 - amountPaid, customerId, creditPaymentTypeEnum, referralCreditUsed }, { transaction });

    return creditPaymentRecord;
  },

  refundCreditCustomer: async(customerId, amountPaid, creditPaymentTypeEnum, transaction) => {
    amountPaid = parseFloat(amountPaid);
    Checker.ifEmptyThrowError(customerId, Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXIsRequired);
    Checker.ifNotNumberThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNegativeThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXCannotBeNegative);

    let customer = await Customer.findByPk(customerId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);
    await customer.update({ creditBalance: customer.creditBalance + amountPaid }, { transaction });
    let creditPaymentRecord = await CreditPaymentRecord.create({ amount: amountPaid, customerId, creditPaymentTypeEnum }, { transaction });

    return creditPaymentRecord;
  },

  refundCreditCustomerWithReferral: async(customerId, amountPaid, creditPaymentTypeEnum, referralCreditUsed, transaction) => {
    amountPaid = parseFloat(amountPaid);
    Checker.ifEmptyThrowError(customerId, Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXIsRequired);
    Checker.ifNotNumberThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNegativeThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXCannotBeNegative);

    let customer = await Customer.findByPk(customerId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);
    await customer.update({ creditBalance: customer.creditBalance + amountPaid, referralCreditMarker: customer.referralCreditMarker + referralCreditUsed }, { transaction });
    let creditPaymentRecord = await CreditPaymentRecord.create({ amount: amountPaid, customerId, creditPaymentTypeEnum }, { transaction });

    return creditPaymentRecord;
  },

  payCreditMerchant: async(merchantId, amountPaid, creditPaymentTypeEnum, transaction) => {
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

    let creditPaymentRecord = await CreditPaymentRecord.create({ amount: 0 - amountPaid, merchantId, creditPaymentTypeEnum }, { transaction });

    return creditPaymentRecord;
  },

  refundCreditMerchant: async(merchantId, amountPaid, creditPaymentTypeEnum, transaction) => {
    amountPaid = parseFloat(amountPaid);
    Checker.ifEmptyThrowError(merchantId, Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXIsRequired);
    Checker.ifNotNumberThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNegativeThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXCannotBeNegative);

    let merchant = await Merchant.findByPk(merchantId);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);
    await merchant.update({ creditBalance: merchant.creditBalance + amountPaid }, { transaction });
    
    let creditPaymentRecord = await CreditPaymentRecord.create({ amount: amountPaid, merchantId, creditPaymentTypeEnum }, { transaction });

    return creditPaymentRecord;
  },

  addReferralBonus: async(customer1Id, customer2Id, transaction) => {
    let bonus = 5;
    let creditPaymentTypeEnum = Constants.CreditPaymentType.ReferralBonus;
    Checker.ifEmptyThrowError(customer1Id, Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(customer2Id, Constants.Error.IdRequired);
    customer1 = await Customer.findByPk(customer1Id);
    customer2 = await Customer.findByPk(customer2Id);
    Checker.ifEmptyThrowError(customer1, Constants.Error.CustomerNotFound)
    Checker.ifEmptyThrowError(customer2, Constants.Error.CustomerNotFound)
    await Customer.update({ creditBalance: customer1.creditBalance + bonus, referralCreditMarker: customer1.creditBalance + bonus }, { transaction });
    await Customer.update({ creditBalance: customer2.creditBalance + bonus, referralCreditMarker: customer2.creditBalance + bonus }, { transaction });
    await CreditPaymentRecord.create({ amount: bonus, customer1Id, creditPaymentTypeEnum }, { transaction });
    await CreditPaymentRecord.create({ amount: bonus, customer2Id, creditPaymentTypeEnum }, { transaction });

  }
};