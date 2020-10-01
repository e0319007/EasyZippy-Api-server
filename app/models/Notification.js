const Sequelize = require('sequelize');
const {
  INTEGER, STRING, DATE, BOOLEAN, Model
} = Sequelize;
const sequelize = require('../common/database');

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
    title: {
      type: STRING,
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
    },
    senderModel: {
      type: STRING,
      allowNull: true
    },
    senderId: {
      type: INTEGER,
      allowNull: true
    },
    receiverModel: {
      type: STRING,
      allowNull: true
    },
    receiverId: {
      type: INTEGER,
      allowNull: true
    },
    forStaff: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'notification',
    underscored: true
  }
);

module.exports = Notification;