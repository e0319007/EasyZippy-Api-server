const Sequelize = require('sequelize');
const {
  INTEGER, STRING, DECIMAL, Model
} = Sequelize;
const sequelize = require('../common/database');

const Merchant = require('./Merchant');
const Customer = require('./Customer');
const { validate } = require('email-validator');

class CreditPaymentRecord extends Model {
}

CreditPaymentRecord.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    amount: {
      type: DECIMAL,
      allowNull: false,
    },
    creditPaymentTypeEnum: {
      type: STRING,
      allowNull: false
    },
    referralCreditUsed: {
      type: DECIMAL,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0.0
      }
    }
  },
  {
    sequelize,
    modelName: 'creditPaymentRecord',
    underscored: true
  }
);

CreditPaymentRecord.belongsTo(Merchant);
Merchant.hasMany(CreditPaymentRecord);

CreditPaymentRecord.belongsTo(Customer);
Customer.hasMany(CreditPaymentRecord);

module.exports = CreditPaymentRecord;