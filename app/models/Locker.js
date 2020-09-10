const Sequelize = require('sequelize');
const {
  INTEGER, ENUM, Model
} = Sequelize;
const sequelize = require('../common/database');

const Kiosk = require('./Kiosk');
const LockerActionRecord = require('./LockerActionRecord');
const LockerType = require('./LockerType');
const { LockerStatus } = require('../common/constants');

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
    // lockerStatus: {
    //   type: ENUM(LockerStatus.Disabled, LockerStatus.Empty, LockerStatus.InUse),
    //   allowNull: false
    // }
  },
  {
    sequelize,
    modelName: 'locker',
    underscored: true
  }
);

Locker.belongsTo(LockerType);
LockerType.hasMany(LockerType, { foreignKey: { allowNull: false } });

Locker.hasMany(LockerActionRecord);

Locker.belongsTo(Kiosk, { foreignKey: { allowNull: false } });
Kiosk.hasMany(Locker);

module.exports = Locker;