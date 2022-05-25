'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order_orderItems extends Model {
    static associate(models) {}
  }
  Order_orderItems.init(
    {
      orderId: DataTypes.INTEGER,
      orderItemId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Order_orderItems',
      paranoid: true,
    }
  );
  return Order_orderItems;
};
