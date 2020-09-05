const Sequelize = require('sequelize');
const {
  INTEGER, STRING, Model, BOOLEAN
} = Sequelize;
const sequelize = require('../common/database');

class Merchant extends Model {
}

Merchant.init(
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
    mobileNumber: {
      type: STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: STRING,
      allowNull: false
    },
    email: {
      type: STRING,
      allowNull: false,
      unique: true
    },
    approved: {
      allowNull: false,
      type: BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'merchant',
    underscored: true
  }
);

module.exports = Merchant;