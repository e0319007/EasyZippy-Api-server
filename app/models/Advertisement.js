const Sequelize = require('sequelize');
const {
  INTEGER, DATE, Model, STRING, BOOLEAN
} = Sequelize;
const sequelize = require('../common/database');
const { INTEGER, DATE, STRING, DECIMAL, BOOLEAN } = require('sequelize');

class Advertisement extends Model {
}

Advertisement.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    description: {
      type: STRING,
      allowNull: false
    },
    imageUrl: {
      type: STRING,
      allowNull: false
    },
    startDate: {
      type: DATE,
      allowNull: false
    },
    endDate: {
      type: DATE,
      allowNull: false
    },
    amountPaid: {
      type: DECIMAL,
      allowNull: false
    },
    expired: {
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