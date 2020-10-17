const Sequelize = require('sequelize');
const {
  INTEGER, DATE, BOOLEAN, Model
} = Sequelize;
const sequelize = require('../common/database');

const Customer = require('./Customer');
const Merchant = require('./Merchant');
const BookingPackageModel = require('./BookingPackageModel');
const CreditPaymentRecord = require('./CreditPaymentRecord');

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
    startDate: {
      type: DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    endDate: {
      type: DATE,
      allowNull: false
    },
    expired: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'bookingPackage',
    underscored: true
  }
);

BookingPackage.belongsTo(CreditPaymentRecord, { foreignKey: { allowNull: false } });
CreditPaymentRecord.hasOne(BookingPackage);

BookingPackage.belongsTo(Customer);
Customer.hasMany(BookingPackage);

BookingPackage.belongsTo(Merchant);
Merchant.hasMany(BookingPackage);

BookingPackage.belongsTo(BookingPackageModel, { foreignKey: { allowNull: false } });
BookingPackageModel.hasMany(BookingPackage);

module.exports = BookingPackage;
