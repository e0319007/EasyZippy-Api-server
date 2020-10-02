const Sequelize = require('sequelize');
const {
  INTEGER, BOOLEAN, STRING, Model
} = Sequelize;
const sequelize = require('../common/database');

const Kiosk = require('./Kiosk');
const LockerActionRecord = require('./LockerActionRecord');
const LockerType = require('./LockerType');

class Locker extends Model {
}

Locker.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    lockerStatusEnum: {
      type: STRING,
      allowNull: false
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
    modelName: 'locker',
    underscored: true
  }
);

Locker.belongsTo(LockerType, { foreignKey: { allowNull: false } });
LockerType.hasMany(Locker);

Locker.hasMany(LockerActionRecord);

Locker.belongsTo(Kiosk, { foreignKey: { allowNull: false } });
Kiosk.hasMany(Locker);

module.exports = Locker;