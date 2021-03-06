const Sequelize = require('sequelize');
const {
  INTEGER, STRING, BOOLEAN, DECIMAL, Model
} = Sequelize;
const sequelize = require('../common/database');

class Customer extends Model {
}

Customer.init(
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
      allowNull: true,
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
    activated: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    creditBalance: {
      type: DECIMAL,
      allowNull: false,
      defaultValue: 0.0,
      validate: {
          min: 0.0
      }
    },
    referralCreditMarker: {
      type: DECIMAL,
      allowNull: false,
      defaultValue: 0.0,
      validate: {
          min: 0.0
      }
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
    oneTimePin: {
      type: STRING,
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: 'customer',
    underscored: true
  }
);

Customer.belongsTo(Customer, { as: 'referrer' });
Customer.hasMany(Customer, { as: 'referee' });
module.exports = Customer;