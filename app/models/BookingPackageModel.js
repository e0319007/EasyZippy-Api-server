const Sequelize = require('sequelize');
const {
  INTEGER, STRING, Model, DECIMAL
} = Sequelize;
const sequelize = require('../common/database');

class BookingPackageModel extends Model {
}

BookingPackageModel.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: STRING,
      allowNull: false
    },
    description: {
      type: STRING,
      allowNull: false,
      defaultValue: ""
    },
    quota: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
          min: 1
      }
    },
    price: {
      type: DECIMAL,
      allowNull: false,
      validate: {
          min: 0.0
      }
    },
    duration: {
      type: INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    }
  },
  {
    sequelize,
    modelName: 'bookingPackageModel',
    underscored: true
  }
);

module.exports = BookingPackageModel;