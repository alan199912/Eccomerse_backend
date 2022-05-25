'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
require('dotenv').config();
const basename = path.basename(__filename);
const env = process.env.NODE_ENV;
const config = require(__dirname + '/../config/config.json')[env];
const { sequelizeFromDB } = require('../db/db');
const User = require('./user');
const Roles = require('./roles');
const Products = require('./products');
const Category = require('./category');
const OrderItems = require('./orderitems');
const Order = require('./orders');
const MainProductImage = require('./mainproductimage');
const RestProductImage = require('./restproductimage');
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = sequelizeFromDB;
  try {
    // sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    sequelize.close();
  }
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.user = User;
db.roles = Roles;
db.mainProductImage = MainProductImage;
db.restProductImage = RestProductImage;
db.products = Products;
db.category = Category;
db.orderItems = OrderItems;
db.order = Order;

module.exports = db;
