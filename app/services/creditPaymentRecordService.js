const Checker = require('../common/checker');
const Constants = require('../common/constants');
const CustomError = require('../common/error/customError');
const CreditPaymentRecord = require('../models/CreditPaymentRecord');
const { Op } = require("sequelize");

const Customer = require('../models/Customer')
const Merchant = require('../models/Merchant')

module.exports = {
  retrieveCreditPaymentRecordByCustomerId: async(customerId) => {
    return await CreditPaymentRecord.findAll({ where: {customerId} })
  },

  retrieveCreditPaymentRecordByMerchantId: async(merchantId) => {
    return await CreditPaymentRecord.findAll({ where: { merchantId } });
  },

  retrieveAllCreditPaymentRecordsOfCustomer: async() => {
    return await CreditPaymentRecord.findAll({ 
      where: {
      customerId: { 
        [Op.ne]: null
      } 
    }});
  },
  
  retrieveAllCreditPaymentRecordsOfMerchant: async() => {
    return await CreditPaymentRecord.findAll({ 
      where: {
      merchantId: { 
        [Op.ne]: null
      } 
    }});
  },

  retrieveAllCreditPaymentRecords: async() => {
    return await CreditPaymentRecord.findAll();
  },

  payCreditCustomer: async(customerId, amountPaid, creditPaymentTypeEnum, transaction) => {
    amountPaid = Number(Number(amountPaid).toFixed(2));
    Checker.ifEmptyThrowError(customerId, Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXIsRequired);
    Checker.ifNotNumberThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNegativeThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXCannotBeNegative);
    let customer = await Customer.findByPk(customerId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);
    
    let referralCreditMarker = customer.referralCreditMarker;
    let referralCreditUsed;

    if(creditPaymentTypeEnum === Constants.CreditPaymentType.BOOKING) {
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
    newCreditAmount = Number(newCreditAmount.toFixed(2));
    await customer.update({ creditBalance: newCreditAmount, referralCreditMarker }, { transaction });
    let creditPaymentRecord = await CreditPaymentRecord.create({ amount: 0 - amountPaid, customerId, creditPaymentTypeEnum, referralCreditUsed }, { transaction });

    return creditPaymentRecord;
  },

  increaseCreditCustomer: async(customerId, amountPaid, creditPaymentTypeEnum, transaction) => {
    amountPaid = Number(Number(amountPaid).toFixed(2));
    console.log('customerID' + customerId)
    Checker.ifEmptyThrowError(customerId, Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXIsRequired);
    Checker.ifNotNumberThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNegativeThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXCannotBeNegative);

    let customer = await Customer.findByPk(customerId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);
    console.log(customer)
    let creditBalance = Number(customer.creditBalance) + Number(amountPaid)
    customer = await customer.update({ creditBalance }, { transaction });
    let creditPaymentRecord = await CreditPaymentRecord.create({ amount: amountPaid, customerId, creditPaymentTypeEnum }, { transaction });

    return creditPaymentRecord;
  },

  refundCreditCustomerWithReferral: async(customerId, amountPaid, creditPaymentTypeEnum, referralCreditUsed, transaction) => {
    amountPaid = Number(Number(amountPaid).toFixed(2));
    Checker.ifEmptyThrowError(customerId, Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXIsRequired);
    Checker.ifNotNumberThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNegativeThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXCannotBeNegative);

    let customer = await Customer.findByPk(customerId);
    Checker.ifEmptyThrowError(customer, Constants.Error.CustomerNotFound);
    let creditBalance = Number(customer.creditBalance) + Number(amountPaid)
    let referralCreditMarker = Number(customer.referralCreditMarker) + Number(referralCreditUsed);
    await customer.update({ creditBalance, referralCreditMarker }, { transaction });
    let creditPaymentRecord = await CreditPaymentRecord.create({ amount: amountPaid, customerId, creditPaymentTypeEnum }, { transaction });

    return creditPaymentRecord;
  },

  payCreditMerchant: async(merchantId, amountPaid, creditPaymentTypeEnum, transaction) => {
    amountPaid = Number(Number(amountPaid).toFixed(2));
    Checker.ifEmptyThrowError(merchantId, Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXIsRequired);
    Checker.ifNotNumberThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNegativeThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXCannotBeNegative);

    let merchant = await Merchant.findByPk(merchantId);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);
    if (amountPaid <= merchant.creditBalance) {
      let newCreditAmount = Number(merchant.creditBalance) -  Number(amountPaid);
      newCreditAmount = Number(newCreditAmount.toFixed(2));
      console.log('new credit amount ' + newCreditAmount)
      await merchant.update({ creditBalance: newCreditAmount }, { transaction });
    } else throw new CustomError(Constants.Error.InsufficientCreditBalance);
    
    let creditPaymentRecord = await CreditPaymentRecord.create({ amount: 0 - amountPaid, merchantId, creditPaymentTypeEnum }, { transaction });

    return creditPaymentRecord;
  },

  increaseCreditMerchant: async(merchantId, amountPaid, creditPaymentTypeEnum, transaction) => {
    amountPaid = Number(Number(amountPaid).toFixed(2));
    Checker.ifEmptyThrowError(merchantId, Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXIsRequired);
    Checker.ifNotNumberThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXMustBeNumber);
    Checker.ifNegativeThrowError(amountPaid, 'Amount paid ' + Constants.Error.XXXCannotBeNegative);
 
    let merchant = await Merchant.findByPk(merchantId);
    Checker.ifEmptyThrowError(merchant, Constants.Error.MerchantNotFound);
    await merchant.update({ creditBalance: Number(merchant.creditBalance) + Number(amountPaid) }, { transaction });
    
    let creditPaymentRecord = await CreditPaymentRecord.create({ amount: amountPaid, merchantId, creditPaymentTypeEnum }, { transaction });

    return creditPaymentRecord;
  },

  addReferralBonus: async(customer1Id, customer2Id, transaction) => {
    const bonus = Number(5);
    let creditPaymentTypeEnum = Constants.CreditPaymentType.REFERRAL_BONUS;
    Checker.ifEmptyThrowError(customer1Id, Constants.Error.IdRequired);
    Checker.ifEmptyThrowError(customer2Id, Constants.Error.IdRequired);
    customer1 = await Customer.findByPk(customer1Id);
    customer2 = await Customer.findByPk(customer2Id);
    Checker.ifEmptyThrowError(customer1, Constants.Error.CustomerNotFound)
    Checker.ifEmptyThrowError(customer2, Constants.Error.CustomerNotFound)
    let creditBalance1 = Number(customer1.creditBalance) + 5;
    let creditBalance2 = Number(customer2.creditBalance) + 5;
    let marker1 = Number(customer1.referralCreditMarker) + 5;
    let marker2 = Number(customer2.referralCreditMarker) + 5;
 
    customer1 = await customer1.update({ creditBalance: creditBalance1, referralCreditMarker: marker1 }, { transaction });
    customer2 = await customer2.update({ creditBalance: creditBalance2, referralCreditMarker: marker2 }, { transaction });
    await CreditPaymentRecord.create({ amount: bonus, customerId: customer1Id, creditPaymentTypeEnum }, { transaction });
    await CreditPaymentRecord.create({ amount: bonus, customerId: customer2Id, creditPaymentTypeEnum }, { transaction });
    return customer2
  }
};