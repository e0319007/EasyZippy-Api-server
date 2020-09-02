const Sequelize = require('sequelize');
const {
  INTEGER, Model
} = Sequelize;
const sequelize = require('../common/database');

class Locker extends Model {
}

Locker.init(
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
    modelName: 'locker',
    underscored: true
  }
);

module.exports = Locker;