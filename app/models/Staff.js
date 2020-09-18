const Sequelize = require('sequelize');
const {
  INTEGER, STRING, BOOLEAN,  Model
} = Sequelize;
const sequelize = require('../common/database');
const { StaffRole } = require('../common/constants');

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
    disabled: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    resetPasswordToken: {
      type: STRING,
      allowNull: true
    },
    resetPasswordExpires: {
      type: Sequelize.DATE,
      allowNull: true
    },
    staffRoleEnum: {
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