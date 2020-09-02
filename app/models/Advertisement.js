const Sequelize = require('sequelize');
const {
  INTEGER, DATE, Model, DECIMAL, STRING, BOOLEAN
} = Sequelize;
const sequelize = require('../common/database');

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
      allowNull: false,
      defaultValue: ""
    },
    imageUrl: {
      type: STRING,
      allowNull: false,
      defaultValue: ""
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
      allowNull: false,
      validate: {
          min: 0.0
      }
    },
    expired: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'advertisement',
    underscored: true
  }
);

module.exports = Advertisement;