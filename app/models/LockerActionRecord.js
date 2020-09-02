const Sequelize = require('sequelize');
const {
  INTEGER, DATE, Model
} = Sequelize;
const sequelize = require('../common/database');
const { INTEGER, DATE } = require('sequelize');

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
    }
  },
  {
    sequelize,
    modelName: 'lockerActionRecord',
    underscored: true
  }
);

module.exports = LockerActionRecord;