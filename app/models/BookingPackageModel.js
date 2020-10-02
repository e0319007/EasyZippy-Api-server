const Sequelize = require('sequelize');
const {
  INTEGER, STRING, BOOLEAN, DECIMAL, Model
} = Sequelize;
const sequelize = require('../common/database');

const LockerType = require('./LockerType');

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
      allowNull: true
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
    },
    published: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    disabled: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    used: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'bookingPackageModel',
    underscored: true
  }
);

BookingPackageModel.belongsTo(LockerType, { foreignKey: { allowNull: false } });

module.exports = BookingPackageModel;