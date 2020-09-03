const Sequelize = require('sequelize');
const {
  INTEGER, DATE, Model, DECIMAL
} = Sequelize;
const sequelize = require('../common/database');

const Customer = require('./Customer');
const Merchant = require('./Merchant');

class Order extends Model {
}

Order.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    promoIdUsed: {
      type: INTEGER,
      allowNull: true
    },
    totalAmount: {
      type: DECIMAL,
      allowNull: false,
      validate: {
          min: 0.0
      }
    },
    orderDate: {
      type: DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  },
  {
    sequelize,
    modelName: 'order',
    underscored: true
  }
);

Customer.hasMany(Order);
Order.belongsTo(Customer, { foreignKey: { allowNull: false } });

Merchant.hasMany(Order);
Order.belongsTo(Merchant, { foreignKey: { allowNull: false } });

module.exports = Order;