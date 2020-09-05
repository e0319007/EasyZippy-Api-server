const Sequelize = require('sequelize');
const {
  INTEGER, Model
} = Sequelize;
const sequelize = require('../common/database');

const Customer = require('./Customer')

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

Customer.hasOne(Cart, { foreignKey: { allowNull: false } });
Cart.belongsTo(Customer, { foreignKey: { allowNull: false } });

module.exports = Cart;