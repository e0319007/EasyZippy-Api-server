const Sequelize = require('sequelize');
const {
  INTEGER, STRING, DECIMAL, JSON, DATE, ENUM, Model
} = Sequelize;
const sequelize = require('../common/database');
const Merchant = require('./Merchant');
const Customer = require('./Customer');


class ExternalPaymentRecord extends Model {
}


ExternalPaymentRecord.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    externalId: {
      type: STRING,
      allowNull: true
    },
    amount: {
      type: DECIMAL,
      allowNull: false,
      validate: {
        min: 0.0
      }
    },
    code: {
      type: DECIMAL,
      allowNull: true
    },
    payload: {
      type: JSON,
      allowNull: true
    },
    paymentDate: {
      type: DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    // paymentType: {
    //   type: ENUM('cash', 'creditCard', 'paylah', 'paynow'),
    //   allowNull: false
    // }
  },
  {
    sequelize,
    modelName: 'externalPaymentRecord',
    underscored: true
  }
);

ExternalPaymentRecord.belongsTo(Merchant);
Merchant.hasMany(ExternalPaymentRecord);

ExternalPaymentRecord.belongsTo(Customer);
Customer.hasMany(ExternalPaymentRecord);

module.exports = ExternalPaymentRecord;