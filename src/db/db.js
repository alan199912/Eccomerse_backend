const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelizeFromDB = new Sequelize(
  process.env.DB_DATABASE.toString(),
  process.env.DB_USER.toString(),
  process.env.DB_PASSWORD.toString(),
  {
    host: process.env.DB_HOST.toString(),
    dialect: 'mysql',
  }
);

module.exports = { sequelizeFromDB };
