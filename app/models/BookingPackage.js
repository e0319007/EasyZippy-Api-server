const Sequelize = require('sequelize');
const {
  INTEGER, DATE, Model
} = Sequelize;
const sequelize = require('../common/database');

const Customer = require('./Customer');
const Merchant = require('./Merchant');
const BookingPackageModel = require('./BookingPackageModel');

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
      allowNull: false,
      validate: {
          min: 0
      },
      defaultValue: 0
    },
    promoIdUsed: {
      type: INTEGER,
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
    modelName: 'bookingPackage',
    underscored: true
  }
);

BookingPackage.belongsTo(Customer);
Customer.hasMany(BookingPackage);

BookingPackage.belongsTo(Merchant);
Merchant.hasMany(BookingPackage);

BookingPackage.belongsTo(BookingPackageModel, { foreignKey: { allowNull: false } });
BookingPackageModel.hasMany(BookingPackage);

module.exports = BookingPackage;