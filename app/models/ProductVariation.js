const Sequelize = require('sequelize');
const {
  INTEGER, STRING, DECIMAL, ARRAY, BOOLEAN, DATE, TEXT, Model
} = Sequelize;
const sequelize = require('../common/database');
const Product = require('./Product');

class ProductVariation extends Model {
}

ProductVariation.init(
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
    image: {
      type: TEXT,
      allowNull: true
    },
    productDisabled: {
      type: BOOLEAN,
      defaultValue: false,
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
    }
  },
  {
    sequelize,
    modelName: 'productVariation',
    underscored: true
  }
);

ProductVariation.belongsTo(Product, { foreignKey: { allowNull: false } });
Product.hasMany(ProductVariation);

module.exports = ProductVariation;