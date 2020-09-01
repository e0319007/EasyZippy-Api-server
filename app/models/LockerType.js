const Sequelize = require('sequelize');
const {
  INTEGER, DATE, Model,STRING, DOUBLE
} = Sequelize;
const sequelize = require('../common/database');
const { INTEGER, DATE, DECIMAL } = require('sequelize');

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
      allowNull: false
    },
    width: {
      type: DOUBLE,
      allowNull: false
    },
    length: {
      type: DOUBLE,
      allowNull: false
    },
    price: {
      type: DECIMAL,
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