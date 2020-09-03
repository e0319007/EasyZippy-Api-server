const Sequelize = require('sequelize');
const {
  INTEGER, Model
} = Sequelize;
const sequelize = require('../common/database');

class Cart extends Model {
}

Cart.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'cart',
    underscored: true
  }
);

module.exports = Cart;