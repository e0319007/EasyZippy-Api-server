const Sequelize = require('sequelize');
const {
  INTEGER, STRING, Model
} = Sequelize;
const sequelize = require('../common/database');

class Staff extends Model {
}

Staff.init(
  {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'staff',
    underscored: true
  }
);

module.exports = Staff;