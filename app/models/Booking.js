const Sequelize = require('sequelize');
const {
  INTEGER, DATE, Model, STRING
} = Sequelize;
const sequelize = require('../common/database');

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
    }
  },
  {
    sequelize,
    modelName: 'booking',
    underscored: true
  }
);

module.exports = Booking;