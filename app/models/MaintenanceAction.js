const Sequelize = require('sequelize');
const {
  INTEGER, DATE, BOOLEAN, STRING, Model
} = Sequelize;
const sequelize = require('../common/database');
const Kiosk = require('./Kiosk');

const Locker = require('./Locker');

class MaintenanceAction extends Model {
}

MaintenanceAction.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    description: {
      type: STRING,
      allowNull: true
    },
    maintenanceDate: {
      type: DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    deleted: {
      type: BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'maintenanceAction',
    underscored: true
  }
);

MaintenanceAction.belongsTo(Locker, { foreignKey: { allowNull: false } });
Locker.hasMany(MaintenanceAction);

MaintenanceAction.belongsTo(Kiosk, { foreignKey: { allowNull: false } });
Kiosk.hasMany(MaintenanceAction);

module.exports = MaintenanceAction;