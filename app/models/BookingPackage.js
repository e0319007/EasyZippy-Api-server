const Sequelize = require('sequelize');
const {
  INTEGER, DATE, Model
} = Sequelize;
const sequelize = require('../common/database');
const { INTEGER, DATE } = require('sequelize');

class BookingPackage extends Model {
}

BookingPackage.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    lockerCount: {
      type: INTEGER,
      allowNull: false
    },
    promoIdUsed: {
      type: INTEGER,
      allowNull: false
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
    modelName: 'staff',
    underscored: true
  }
);

module.exports = Staff;