const Sequelize = require('sequelize');
const {
  INTEGER, STRING, DECIMAL, JSON, DATE, Model
} = Sequelize;
const sequelize = require('../common/database');
const { PaymentStatus, PaymentType } = require('../common/constants');

const Booking = require('./Booking');
const BookingPackage = require('./BookingPackage');
const Order = require('./Order');
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
    // paymentStatus: {
    //   type: ENUM(PaymentStatus.Cancelled, PaymentStatus.Paid),
    //   allowNull: false
    // },
    // paymentType: {
    //   type: ENUM(PaymentType.Cash, PaymentType.CreditCard, PaymentType.Paylah, PaymentType.Paynow),
    //   allowNull: false
    // }
  },
  {
    sequelize,
    modelName: 'creditPaymentRecord',
    underscored: true
  }
);

CreditPaymentRecord.belongsTo(Booking);
Booking.hasMany(CreditPaymentRecord, { foreignKey: { allowNull: false } });

CreditPaymentRecord.belongsTo(BookingPackage);
BookingPackage.hasMany(CreditPaymentRecord, { foreignKey: { allowNull: false } });

CreditPaymentRecord.belongsTo(Order);
Order.hasMany(CreditPaymentRecord, { foreignKey: { allowNull: false } });

CreditPaymentRecord.belongsTo(Merchant);
Merchant.hasMany(CreditPaymentRecord);

CreditPaymentRecord.belongsTo(Customer);
Customer.hasMany(CreditPaymentRecord);

module.exports = CreditPaymentRecord;