const Sequelize = require('sequelize');
const {
  INTEGER, STRING, Model
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
    }
  },
  {
    sequelize,
    modelName: 'category',
    underscored: true
  }
);

module.exports = Category;