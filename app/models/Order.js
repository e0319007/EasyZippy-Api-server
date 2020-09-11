const Sequelize = require('sequelize');
const {
  INTEGER, DATE, DECIMAL, ENUM, Model
} = Sequelize;
const sequelize = require('../common/database');
const { OrderStatus } = require('../common/constants');

const Customer = require('./Customer');
const LineItem = require('./LineItem');
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

Order.belongsTo(Customer, { foreignKey: { allowNull: false } });
Customer.hasMany(Order);

Order.belongsTo(Merchant, { foreignKey: { allowNull: false } });
Merchant.hasMany(Order);

Order.hasMany(LineItem);

module.exports = Order;