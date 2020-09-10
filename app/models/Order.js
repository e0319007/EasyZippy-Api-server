const Sequelize = require('sequelize');
const {
  INTEGER, DATE, DECIMAL, ENUM, Model
} = Sequelize;
const sequelize = require('../common/database');

const Customer = require('./Customer');
const Merchant = require('./Merchant');
const { OrderStatus } = require('../common/constants');
const LineItem = require('./LineItem');

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
    },
    // orderStatus: {
    //   type: ENUM(OrderStatus.Cancelled, OrderStatus.PendingPayment, OrderStatus.Processing, OrderStatus.ReadyForCollection, OrderStatus.Refund),
    //   allowNull: false
    // }
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

Order.hasMany(LineItem);

module.exports = Order;