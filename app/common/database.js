const Sequelize = require('sequelize');
const config = require('config');

const sequelize = new Sequelize(config.get('postgres.database'), config.get('postgres.user'), config.get('postgres.password'), {
  dialect: 'postgres',
  host: config.get('postgres.host'),
  logging: false
});

module.exports = sequelize;