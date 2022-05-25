'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      this.hasMany(models.Products, {
        foreignKey: 'categoryId',
        onDelete: 'CASCADE',
      });
    }
  }
  Category.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Category',
      paranoid: true,
    }
  );
  return Category;
};
