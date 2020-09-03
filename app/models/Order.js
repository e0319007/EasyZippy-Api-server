const Sequelize = require('sequelize');
const {
  INTEGER, DATE, Model, DECIMAL
} = Sequelize;
const sequelize = require('../common/database');

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

module.exports = Order;