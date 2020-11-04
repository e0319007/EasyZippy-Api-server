const { TEXT } = require('sequelize');
const Sequelize = require('sequelize');
const {
  INTEGER, STRING, DECIMAL, ARRAY, BOOLEAN, DATE, Model
} = Sequelize;
const sequelize = require('../common/database');

const Category = require('./Category');
const Merchant = require('./Merchant');

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
    images: {
      type: ARRAY(TEXT),
      allowNull: false
    },
    disabled: {
      type: BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    deleted: {
      type: BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    quantitySold: {
      type: INTEGER,
      allowNull: false,
      validate: {
        min: 0
      },
      defaultValue: 0
    },
  },
  {
    sequelize,
    modelName: 'product',
    underscored: true
  }
);

Product.belongsTo(Category, { foreignKey: { allowNull: false } });
Category.hasMany(Product);

Product.belongsTo(Merchant, { foreignKey: { allowNull: false } });
Merchant.hasMany(Product);

module.exports = Product;