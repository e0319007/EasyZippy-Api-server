const Sequelize = require('sequelize');
const {
  INTEGER, STRING, BOOLEAN, Model
} = Sequelize;
const sequelize = require('../common/database');

class Location extends Model {
}

Location.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: STRING,
      allowNull: false
    },
    address: {
      type: STRING,
      allowNull: false
    },
    postalCode: {
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
    modelName: 'location',
    underscored: true
  }
);

module.exports = Location;