const Sequelize = require('sequelize');
const {
  INTEGER, DATE, DECIMAL, STRING, BOOLEAN, Model
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
      allowNull: true
    },
    imageUrl: {
      type: STRING,
      allowNull: true
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