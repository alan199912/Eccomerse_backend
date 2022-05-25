'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.addColumn('Orders', 'transactionId', {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    });
    queryInterface.addColumn('Orders', 'payerId', {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    });
    queryInterface.addColumn('Orders', 'payerEmail', {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    });
    queryInterface.addColumn('Orders', 'orderPaypal', {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    const transaction = await queryInterface.sequelize.transaction();
    await queryInterface.removeColumn('Orders', 'transactionId', { transaction });
    await queryInterface.removeColumn('Orders', 'payerId', { transaction });
    await queryInterface.removeColumn('Orders', 'payerEmail', { transaction });
    await queryInterface.removeColumn('Orders', 'orderPaypal', { transaction });
    await transaction.commit();
  },
};
