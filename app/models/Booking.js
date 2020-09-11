const Sequelize = require('sequelize');
const {
  INTEGER, DATE, STRING, ENUM, Model
} = Sequelize;
const sequelize = require('../common/database');
const { BookingStatus, BookingSource } = require('../common/constants');

const BookingPackage = require('./BookingPackage');
const Customer = require('./Customer');
const Merchant = require('./Merchant');
const Order = require('./Order');
const Locker = require('./Locker');

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
    promoIdUsed: {
      type: INTEGER,
      allowNull: true
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
    // bookingStatus: {
    //   type: ENUM(BookingStatus.Cancelled, BookingStatus.Fufilled, BookingStatus.Unfufilled),
    //   allowNull: false
    // },
    // bookingSource: {
    //   type: ENUM(BookingSource.Kiosk, BookingSource.Mobile),
    //   allowNull: false
    // }
  },
  {
    sequelize,
    modelName: 'booking',
    underscored: true
  }
);

Booking.belongsTo(Order);
Order.hasOne(Booking);

Booking.belongsTo(Customer, { as: 'collector' });
Customer.hasMany(Booking, { as: 'secondaryBooking', foreignKey: 'secondaryBookingId' });

Booking.belongsTo(Customer, { as: 'primaryCustomer'});
Customer.hasMany(Booking, { as: 'primaryBooking', foreignKey: 'primaryBookingId' });

Booking.belongsTo(Merchant);
Merchant.hasMany(Booking);

Booking.belongsTo(BookingPackage);
BookingPackage.hasMany(Booking);

Booking.belongsTo(Locker, { foreignKey: { allowNull: false } });
Locker.hasMany(Booking);

module.exports = Booking;