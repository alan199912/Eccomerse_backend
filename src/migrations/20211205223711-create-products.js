'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      richDescription: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      brand: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      price: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      rating: {
        allowNull: false,
        type: Sequelize.INTEGER,
        isNumeric: true,
      },
      isFeatured: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      categoryId: {
        allowNull: false,
        isNumeric: true,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'Categories',
          key: 'id',
          as: 'categoryId',
        },
      },
      mainProductImageId: {
        allowNull: false,
        isNumeric: true,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'MainProductImages',
          key: 'id',
          as: 'mainProductImageId',
        },
      },
      restProductImageId: {
        allowNull: false,
        isNumeric: true,
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'RestProductImages',
          key: 'id',
          as: 'restProductImageId',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Products');
  },
};
