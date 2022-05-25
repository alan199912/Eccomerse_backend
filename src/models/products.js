'use strict';
const { Model } = require('sequelize');
const { generateCode } = require('../helpers/generateCode');

module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    static associate(models) {
      this.belongsTo(models.Category, {
        foreignKey: 'categoryId',
        onDelete: 'CASCADE',
      });
      this.hasMany(models.OrderItems, {
        foreignKey: 'productId',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.MainProductImage, {
        foreignKey: 'mainProductImageId',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.RestProductImage, {
        foreignKey: 'restProductImageId',
        onDelete: 'CASCADE',
      });
    }
  }
  Products.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      richDescription: DataTypes.STRING,
      code: DataTypes.STRING,
      brand: DataTypes.STRING,
      price: DataTypes.FLOAT,
      rating: DataTypes.INTEGER,
      isFeatured: DataTypes.BOOLEAN,
      categoryId: DataTypes.INTEGER,
      mainProductImageId: DataTypes.INTEGER,
      restProductImageId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Products',
      paranoid: true,
    }
  );

  Products.addHook('beforeCreate', async (product) => {
    product.code = generateCode();
  });

  return Products;
};
