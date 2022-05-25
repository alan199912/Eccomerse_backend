'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItems extends Model {
    static associate(models) {
      this.belongsTo(models.Products, {
        foreignKey: 'productId',
        onDelete: 'CASCADE',
      });
      this.belongsToMany(models.Orders, { through: 'order_orderItems' });
    }
  }
  OrderItems.init(
    {
      productId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'OrderItems',
      paranoid: true,
    }
  );
  return OrderItems;
};
