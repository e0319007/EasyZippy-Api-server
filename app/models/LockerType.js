const Sequelize = require('sequelize');
const {
  INTEGER,STRING, DOUBLE, DECIMAL, Model
} = Sequelize;
const sequelize = require('../common/database');

class LockerType extends Model {
}

LockerType.init(
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
    height: {
      type: DOUBLE,
      allowNull: false,
      validate: {
        min: 0.0
    }
    },
    width: {
      type: DOUBLE,
      allowNull: false,
      validate: {
        min: 0.0
    }
    },
    length: {
      type: DOUBLE,
      allowNull: false,
      validate: {
        min: 0.0
    }
    },
    price: {
      type: DECIMAL,
      allowNull: false,
      validate: {
          min: 0.0
      }
    }
  },
  {
    sequelize,
    modelName: 'lockerType',
    underscored: true
  }
);

module.exports = LockerType;