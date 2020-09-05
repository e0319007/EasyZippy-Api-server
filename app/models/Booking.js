const Sequelize = require('sequelize');
const {
  INTEGER, DATE, STRING, ENUM, Model
} = Sequelize;
const sequelize = require('../common/database');

const BookingPackage = require('./BookingPackage');
const Customer = require('./Customer');
const Merchant = require('./Merchant');
const Order = require('./Order');

const { BookingStatus, BookingSource } = require('../common/constants');

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
    bookingStatus: {
      type: ENUM(BookingStatus.Cancelled, BookingStatus.Fufilled, BookingStatus.Unfufilled),
      allowNull: false
    },
    bookingSource: {
      type: ENUM(BookingSource.Kiosk, BookingSource.Mobile),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'booking',
    underscored: true
  }
);

Booking.belongsTo(Customer, { foreignKey: { allowNull: false } });
Customer.hasMany(Booking);

Booking.belongsTo(Order);
Order.hasOne(Booking, { foreignKey: { allowNull: false } });

Booking.belongsTo(Customer, { as: 'collector' });
Customer.hasMany(Booking, { as: 'secondaryBooking', foreignKey: 'secondaryBookingId' });

Booking.belongsTo(Customer, { as: 'primaryUser'});
Customer.hasMany(Booking, { as: 'primaryBooking', foreignKey: 'primaryBookingId' });

Booking.belongsTo(Merchant);
Merchant.hasMany(Booking);

Booking.belongsTo(BookingPackage, { foreignKey: { allowNull: false } });
BookingPackage.hasMany(Booking)

module.exports = Booking;