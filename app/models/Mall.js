const Sequelize = require('sequelize');
const {
  INTEGER, STRING, BOOLEAN, Model
} = Sequelize;
const sequelize = require('../common/database');

class Mall extends Model {
}

Mall.init(
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
    modelName: 'mall',
    underscored: true
  }
);

module.exports = Mall;