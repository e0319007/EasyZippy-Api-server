const Sequelize = require('sequelize');
const {
  INTEGER, BOOLEAN, STRING, Model
} = Sequelize;
const sequelize = require('../common/database');

class Category extends Model {
}

Category.init(
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
    },
    description: {
      type: STRING,
      allowNull: true
    },
    deleted: {
      type: BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'category',
    underscored: true
  }
);

module.exports = Category;