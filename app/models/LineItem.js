const Sequelize = require('sequelize');
const {
  INTEGER, Model
} = Sequelize;
const sequelize = require('../common/database');
const Cart = require('./Cart');

const Product = require('./Product');
const ProductVariation = require('./ProductVariation');

class LineItem extends Model {
}

LineItem.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    quantity: {
      type: INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
  },
  {
    sequelize,
    modelName: 'lineItem',
    underscored: true
  }
);

LineItem.belongsTo(Product);

LineItem.belongsTo(ProductVariation);

Cart.hasMany(LineItem);
LineItem.belongsTo(Cart);

module.exports = LineItem;