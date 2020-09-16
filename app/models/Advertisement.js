const Sequelize = require('sequelize');
const {
  INTEGER, DATE, DECIMAL, STRING, BOOLEAN, Model
} = Sequelize;
const sequelize = require('../common/database');
const Staff = require('./Staff');
const Merchant = require('./Merchant');

class Advertisement extends Model {
}

Advertisement.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      type: STRING,
      allowNull: false
    },
    description: {
      type: STRING,
      allowNull: true
    },
    imageUrl: {
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
    amountPaid: {
      type: DECIMAL,
      allowNull: false,
      defaultValue: 0.0,
      validate: {
          min: 0.0
      }
    },
    expired: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    advertiserMobile: {
      type: STRING,
      allowNull: true
    },
    advertiserEmail: {
      type: STRING,
      allowNull: true
    },
    approved: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  },
  {
    sequelize,
    modelName: 'advertisement',
    underscored: true
  }
);

Advertisement.belongsTo(Staff);
Staff.hasMany(Advertisement);

Advertisement.belongsTo(Merchant);
Merchant.hasMany(Advertisement);

module.exports = Advertisement;