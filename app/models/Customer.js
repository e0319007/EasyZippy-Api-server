const Sequelize = require('sequelize');
const {
  INTEGER, STRING, Model, BOOLEAN, DECIMAL
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
    },
    activated: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    creditBalance: {
      type: DECIMAL,
      allowNull: false,
      defaultValue: 0.0,
      validate: {
          min: 0.0
      }
    },
  },
  {
    sequelize,
    modelName: 'customer',
    underscored: true
  }
);

module.exports = Customer;