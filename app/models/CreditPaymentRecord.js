const Sequelize = require('sequelize');
const {
  INTEGER, STRING, DECIMAL, Model
} = Sequelize;
const sequelize = require('../common/database');

const Merchant = require('./Merchant');
const Customer = require('./Customer');
const Order = require('./Order');

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

CreditPaymentRecord.belongsTo(Order);
Order.hasMany(CreditPaymentRecord, { foreignKey: { allowNull: false } });

module.exports = CreditPaymentRecord;