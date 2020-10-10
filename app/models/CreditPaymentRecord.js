const Sequelize = require('sequelize');
const {
  INTEGER, STRING, DECIMAL, JSON, DATE, Model
} = Sequelize;
const sequelize = require('../common/database');

const Merchant = require('./Merchant');
const Customer = require('./Customer');

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