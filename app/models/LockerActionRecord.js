const Sequelize = require('sequelize');
const {
  INTEGER, DATE, STRING, Model
} = Sequelize;
const sequelize = require('../common/database');
const Locker = require('./Locker');

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
    lockerActionEnum: {
      type: STRING,
      allowNull: false 
    }
  },
  {
    sequelize,
    modelName: 'lockerActionRecord',
    underscored: true
  }
);
LockerActionRecord.belongsTo(Locker, { foreignKey: {allowNull: false } });
Locker.hasMany(LockerActionRecord);

module.exports = LockerActionRecord;