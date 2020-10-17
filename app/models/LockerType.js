const Sequelize = require('sequelize');
const {
  INTEGER,STRING, DOUBLE, BOOLEAN, DECIMAL, Model
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
    lockerHeight: {
      type: DOUBLE,
      allowNull: false,
      validate: {
        min: 0.0
      }
    },
    lockerWidth: {
      type: DOUBLE,
      allowNull: false,
      validate: {
        min: 0.0
      }
    },
    lockerLength: {
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
    },
    disabled: {
      type: BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    deleted: {
      type: BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'lockerType',
    underscored: true
  }
);

module.exports = LockerType;