const Sequelize = require('sequelize');
const {
  INTEGER, DATE, Model, STRING
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
    description: {
      type: STRING,
      allowNull: false,
      defaultValue: ""
    },
    maintenanceDate: {
      type: DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  },
  {
    sequelize,
    modelName: 'lockerType',
    underscored: true
  }
);

module.exports = LockerType;