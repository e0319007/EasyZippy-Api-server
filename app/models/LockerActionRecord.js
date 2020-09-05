const Sequelize = require('sequelize');
const {
  INTEGER, DATE, ENUM, Model
} = Sequelize;
const sequelize = require('../common/database');
const { LockerAction } = require('../common/constants');

class LockerActionRecord extends Model {
}

LockerActionRecord.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    timestamp: {
      type: DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    lockerAction: {
      type: ENUM(LockerAction.Close, LockerAction.Open),
      allowNull: false 
    }
  },
  {
    sequelize,
    modelName: 'lockerActionRecord',
    underscored: true
  }
);

module.exports = LockerActionRecord;