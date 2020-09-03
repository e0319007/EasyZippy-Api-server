const Sequelize = require('sequelize');
const {
  INTEGER, DATE, Model, STRING
} = Sequelize;
const sequelize = require('../common/database');
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

module.exports = MaintenanceAction;