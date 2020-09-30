const Sequelize = require('sequelize');
const {
  INTEGER, Model
} = Sequelize;
const sequelize = require('../common/database');

const Product = require('./Product');

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

LineItem.belongsTo(Product, { foreignKey: { allowNull: false } });

module.exports = LineItem;