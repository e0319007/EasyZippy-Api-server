const Sequelize = require('sequelize');
const {
  INTEGER, STRING, DATE, FLOAT, Model
} = Sequelize;
const sequelize = require('../common/database');

class Promotion extends Model {
}

Promotion.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    promoCode: {
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
    description: {
      type: STRING,
      allowNull: true
    },
    termsAndConditions: {
      type: STRING,
      allowNull: true
    },
    percentageDiscount: {
      type: FLOAT,
      allowNull: true
    },
    flatDiscount: {
      type: FLOAT,
      allowNull: true
    },
    usageLimit: {
      type: INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    usageCount: {
      type: INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    imageUrl: {
      type: STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'promotion',
    underscored: true
  }
);

module.exports = Promotion;