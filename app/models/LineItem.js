const Sequelize = require('sequelize');
const {
  INTEGER, Model
} = Sequelize;
const sequelize = require('../common/database');

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
    quantityAvailable: {
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

module.exports = LineItem;