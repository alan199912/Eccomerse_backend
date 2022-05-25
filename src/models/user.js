'use strict';
const { Model } = require('sequelize');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsTo(models.Roles, {
        foreignKey: 'roleId',
        onDelete: 'CASCADE',
      });
      this.hasMany(models.Orders, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
    }

    static validPassword(password, passCompare) {
      return bcryptjs.compareSync(password, passCompare);
    }

    static encodePassword(password) {
      const salt = bcryptjs.genSaltSync(10); //  Encrypting password
      return bcryptjs.hashSync(password, salt);
    }

    static async generateToken(id, roleId) {
      return new Promise((resolve, reject) => {
        const payload = { id, roleId };

        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: '24h', algorithm: 'HS256' },
          (err, token) => {
            if (err) {
              console.log(err);
              reject('Error in the token');
            } else {
              resolve(token);
            }
          }
        );
      });
    }
  }

  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      country: DataTypes.STRING,
      phone: DataTypes.STRING,
      name: DataTypes.STRING,
      lastName: DataTypes.STRING,
      status: DataTypes.INTEGER,
      roleId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'User',
      paranoid: true,
    }
  );

  User.addHook('beforeCreate', (user) => {
    const salt = bcryptjs.genSaltSync(10); //  Encrypting password
    user.dataValues.password = bcryptjs.hashSync(user.dataValues.password, salt);
    user.dataValues.roleId = 2;
    user.dataValues.status = 0;
  });

  return User;
};
