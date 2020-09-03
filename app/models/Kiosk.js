const Sequelize = require('sequelize');
const {
  INTEGER, STRING, Model, BOOLEAN
} = Sequelize;
const sequelize = require('../common/database');

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
    location: {
      type: STRING,
      allowNull: false
    },
    description: {
      type: STRING,
      allowNull: true
    },
    enabled: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize,
    modelName: 'kiosk',
    underscored: true
  }
);

module.exports = Kiosk;