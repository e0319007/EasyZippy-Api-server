const Sequelize = require('sequelize');
const {
  INTEGER, DECIMAL, STRING, BOOLEAN, Model
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
    lat: {
      type: DECIMAL,
      allowNull: false
    },
    long: {
      type: DECIMAL,
      allowNull: false
    },
    description: {
      type: STRING,
      allowNull: true
    },
    disabled: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'kiosk',
    underscored: true
  }
);

module.exports = Kiosk;