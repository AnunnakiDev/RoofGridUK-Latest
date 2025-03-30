'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop the username column
    await queryInterface.removeColumn('user', 'username');
  },

  async down(queryInterface, Sequelize) {
    // Add the username column back (for rollback)
    await queryInterface.addColumn('user', 'username', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
  }
};