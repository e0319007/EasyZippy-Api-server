const Sequelize = require('sequelize');
const {
  INTEGER, DATE, BOOLEAN, STRING, Model
} = Sequelize;
const sequelize = require('../common/database');

const Staff = require('./Staff');

class Announcement extends Model {
}

Announcement.init(
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
    sentTime: {
      type: DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    delete: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    modelName: 'announcement',
    underscored: true
  }
);

Staff.hasMany(Announcement);
Announcement.belongsTo(Staff, { foreignKey: { allowNull: false } });

module.exports = Announcement;