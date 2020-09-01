const Sequelize = require('sequelize');
const {
  INTEGER, STRING, Model, DECIMAL
} = Sequelize;
const sequelize = require('../common/database');
const { DECIMAL } = require('sequelize');

class BookingPackageModel extends Model {
}

BookingPackageModel.init(
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
    description: {
      type: STRING,
      allowNull: false
    },
    quota: {
      type: INTEGER,
      allowNull: false
    },
    price: {
      type: DECIMAL,
      allowNull: false
    },
    duration: {
      type: INTEGER,
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