'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    static associate(models) {
      this.belongsToMany(models.OrderItems, { through: 'order_orderItems' });
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
    }
  }
  Orders.init(
    {
      status: DataTypes.STRING,
      totalPrice: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      transactionId: DataTypes.STRING,
      payerId: DataTypes.STRING,
      payerEmail: DataTypes.STRING,
      orderPaypal: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Orders',
      paranoid: true,
    }
  );

  Orders.addHook('beforeCreate', (order) => {
    order.dataValues.status = 'pending';
  });

  return Orders;
};
