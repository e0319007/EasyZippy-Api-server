const Sequelize = require('sequelize');
const {
  INTEGER, BOOLEAN, STRING, Model
} = Sequelize;
const sequelize = require('../common/database');

const Kiosk = require('./Kiosk');
const LockerType = require('./LockerType');
const Constants = require('../common/constants');

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
      allowNull: false,
      defaultValue: Constants.LockerStatus.EMPTY
    },
    lockerCode: {
      type: STRING,
      allowNull: false
    },
    disabled: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    deleted: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
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


Locker.belongsTo(Kiosk, { foreignKey: { allowNull: false } });
Kiosk.hasMany(Locker);

module.exports = Locker;