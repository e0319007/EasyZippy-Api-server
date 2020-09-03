const Sequelize = require('sequelize');
const {
  INTEGER, STRING, DATE, Model
} = Sequelize;
const sequelize = require('../common/database');
const { BOOLEAN } = require('sequelize');

class Notification extends Model {
}

Notification.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    description: {
      type: STRING,
      allowNull: true
    },
    read: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    sentTime: {
      type: DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    }
  },
  {
    sequelize,
    modelName: 'notification',
    underscored: true
  }
);

module.exports = Notification;