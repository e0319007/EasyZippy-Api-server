const Sequelize = require('sequelize');
const {
  INTEGER, STRING, DECIMAL, JSON, DATE, Model
} = Sequelize;
const sequelize = require('../common/database');

class Product extends Model {
}

Product.init(
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
    unitPrice: {
      type: DECIMAL,
      allowNull: false,
      validate: {
        min: 0.0
      }
    },
    description: {
      type: STRING,
      allowNull: true
    },
    quantityAvailable: {
      type: INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    listDate: {
      type: DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  },
  {
    sequelize,
    modelName: 'product',
    underscored: true
  }
);

module.exports = Product;