const Sequelize = require('sequelize');
const {
  INTEGER, Model
} = Sequelize;
const sequelize = require('../common/database');

const Customer = require('./Customer');
const LineItem = require('./LineItem');

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

Cart.belongsTo(Customer, { foreignKey: { allowNull: false } });
Customer.hasOne(Cart/*, { foreignKey: { allowNull: false } }*/);

Cart.hasMany(LineItem);

module.exports = Cart;