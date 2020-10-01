const Sequelize = require('sequelize');
const {
  INTEGER, STRING, DECIMAL, BOOLEAN, Model
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
    tenancyAgreement: {
      type: STRING,
      allowNull: true
    },
    approved: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    disabled: {
      type: BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    resetPasswordToken: {
      type: STRING,
      allowNull: true
    },
    resetPasswordExpires: {
      type: Sequelize.DATE,
      allowNull: true
    },
    creditBalance: {
      type: DECIMAL,
      allowNull: false,
      defaultValue: 0.0,
      validate: {
          min: 0.0
      }
    }, 
    buildingAddress: {
      type: STRING,
      allowNull: true
    },
    blk: {
      type: STRING,
      allowNull: true
    },
    street: {
      type: STRING,
      allowNull: true
    },
    postalCode: {
      type: STRING,
      allowNull: true
    },
    floor: {
      type: STRING,
      allowNull: true
    },
    unitNumber: {
      type: STRING,
      allowNull: true
    },
    pointOfContact: {
      type: STRING,
      allowNull:true
    }
  },
  {
    sequelize,
    modelName: 'merchant',
    underscored: true
  }
);

module.exports = Merchant;