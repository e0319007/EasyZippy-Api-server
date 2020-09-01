const Sequelize = require('sequelize');
const {
  INTEGER, DATE, Model, STRING
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
    description: {
      type: STRING,
      allowNull: false
    },
    maintenanceDate: {
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