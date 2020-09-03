const Sequelize = require('sequelize');
const {
  INTEGER, STRING, Model
} = Sequelize;
const sequelize = require('../common/database');

class Staff extends Model {
}

Staff.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    firstName: {
      type: STRING,
      allowNull: false
    },
    lastName: {
      type: STRING,
      allowNull: false
    },
    mobileNumber: {
      type: STRING,
      allowNull: false
    },
    password: {
      type: STRING,
      allowNull: false
    },
    salt: {
      type: STRING,
      allowNull: false
    },
    email: {
      type: STRING,
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