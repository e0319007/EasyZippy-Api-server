const Sequelize = require('sequelize');
const {
  INTEGER, STRING, BOOLEAN, Model
} = Sequelize;
const sequelize = require('../common/database');
const Location = require('./Location');

class Kiosk extends Model {
}

Kiosk.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    address: {
      type: STRING,
      allowNull: false
    },
    description: {
      type: STRING,
      allowNull: true
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
    modelName: 'kiosk',
    underscored: true
  }
);

Kiosk.belongsTo(Location, { foreignKey: { allowNull: false } });
Location.hasMany(Kiosk);

module.exports = Kiosk;