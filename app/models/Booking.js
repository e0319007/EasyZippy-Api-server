const Sequelize = require('sequelize');
const {
  INTEGER, DATE, STRING, DECIMAL, BOOLEAN, Model
} = Sequelize;
const sequelize = require('../common/database');

const BookingPackage = require('./BookingPackage');
const CreditPaymentRecord = require('./CreditPaymentRecord');
const Customer = require('./Customer');
const Merchant = require('./Merchant');
const Order = require('./Order');
const Locker = require('./Locker');
const Constants = require('../common/constants');
const LockerType = require('./LockerType');
const Kiosk = require('./Kiosk');

class Booking extends Model {
}

Booking.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    qrCode: {
      type: STRING,
      allowNull: true
    },
    startDate: {
      type: DATE,
      allowNull: false
    },
    endDate: {
      type: DATE,
      allowNull: false
    },
    bookingPrice: {
      type: DECIMAL,
      allowNull: true
    },
    bookingStatusEnum: {
      type: STRING,
      allowNull: false,
      defaultValue: Constants.BookingStatus.UNFULFILLED
    },
    bookingSourceEnum: {
      type: STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'booking',
    underscored: true
  }
);

CreditPaymentRecord.hasOne(Booking);
Booking.belongsTo(CreditPaymentRecord);

Booking.belongsTo(Order);
Order.hasOne(Booking);

Booking.belongsTo(Customer, { as: 'collector' });
Customer.hasMany(Booking, { as: 'secondaryBooking'/*, foreignKey: 'secondaryBookingId'*/ });

Booking.belongsTo(Customer);
Customer.hasMany(Booking, { as: 'primaryBooking'/*, foreignKey: 'primaryBookingId' */});

Booking.belongsTo(Merchant);
Merchant.hasMany(Booking);

Booking.belongsTo(BookingPackage);
BookingPackage.hasMany(Booking);

Booking.belongsTo(Locker);
Locker.hasMany(Booking);

Booking.belongsTo(LockerType, { foreignKey: { allowNull: false } });
LockerType.hasMany(Booking);

Booking.belongsTo(Kiosk, { foreignKey: { allowNull: false } })
Kiosk.hasMany(Booking)

module.exports = Booking;