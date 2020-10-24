const Sequelize = require('sequelize');
const {
  INTEGER, DATE, DECIMAL, STRING, Model
} = Sequelize;
const sequelize = require('../common/database');

const Customer = require('./Customer');
const CreditPaymentRecord = require('./CreditPaymentRecord');
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
    orderStatusEnum: {
      type: STRING,
      allowNull: false
    },
    collectionMethodEnum: {
      type: STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'order',
    underscored: true
  }
);

Order.belongsTo(CreditPaymentRecord, { foreignKey: { allowNull: false } });
CreditPaymentRecord.hasOne(Order);

Order.belongsTo(Customer, { foreignKey: { allowNull: false } });
Customer.hasMany(Order);

Order.belongsTo(Merchant, { foreignKey: { allowNull: false } });
Merchant.hasMany(Order);


module.exports = Order;