'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    static associate(models) {
      this.hasMany(models.User, {
        foreignKey: 'roleId',
        onDelete: 'CASCADE',
      });
    }
  }
  Roles.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Roles',
      paranoid: true,
    }
  );
  return Roles;
};
