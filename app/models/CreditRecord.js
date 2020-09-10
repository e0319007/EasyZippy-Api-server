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

class CreditRecord extends Model {
}

CreditRecord.init(
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
    modelName: 'creditRecord',
    underscored: true
  }
);

CreditRecord.belongsTo(Booking);
Booking.hasMany(CreditRecord, { foreignKey: { allowNull: false } });

CreditRecord.belongsTo(BookingPackage);
BookingPackage.hasMany(CreditRecord, { foreignKey: { allowNull: false } });

CreditRecord.belongsTo(Order);
BookingPackage.hasMany(CreditRecord, { foreignKey: { allowNull: false } });

CreditRecord.belongsTo(Merchant);
Merchant.hasMany(CreditRecord);

CreditRecord.belongsTo(Customer);
Customer.hasMany(CreditRecord);

module.exports = CreditRecord;