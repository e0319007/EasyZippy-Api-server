const Sequelize = require('sequelize');
const {
  INTEGER, STRING, Model, BOOLEAN
} = Sequelize;
const sequelize = require('../common/database');
const { GEOMETRY } = require('sequelize');

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
      type: GEOMETRY,
      allowNull: false
    },
    description: {
      type: STRING,
      allowNull: false
    },
    enabled: {
      type: BOOLEAN,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'staff',
    underscored: true
  }
);

module.exports = Staff;