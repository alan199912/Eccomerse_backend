'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RestProductImage extends Model {
    static associate(models) {
      this.hasMany(models.Products, {
        foreignKey: 'restProductImageId',
        onDelete: 'CASCADE',
      });
    }
  }
  RestProductImage.init(
    {
      files: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'RestProductImage',
      paranoid: true,
    }
  );
  return RestProductImage;
};
