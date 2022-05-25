'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MainProductImage extends Model {
    static associate(models) {
      this.hasMany(models.Products, {
        foreignKey: 'mainProductImageId',
        onDelete: 'CASCADE',
      });
    }
  }
  MainProductImage.init(
    {
      file: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'MainProductImage',
      paranoid: true,
    }
  );
  return MainProductImage;
};
