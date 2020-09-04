const Sequelize = require('sequelize');
const {
  INTEGER, STRING, DECIMAL, JSON, DATE, ENUM, Model
} = Sequelize;
const sequelize = require('../common/database');
const { PaymentStatus, PaymentType } = require('../common/constants');

class PaymentRecord extends Model {
}

PaymentRecord.init(
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
    paymentStatus: {
      type: ENUM(PaymentStatus.Cancelled, PaymentStatus.Paid),
      allowNull: false
    },
    paymentType: {
      type: ENUM(PaymentType.Cash, PaymentType.CreditCard, PaymentType.Paylah, PaymentType.Paynow),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'paymentRecord',
    underscored: true
  }
);

module.exports = PaymentRecord;