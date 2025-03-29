'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableInfo = await queryInterface.describeTable('user');
    if (!tableInfo.email) {
      await queryInterface.addColumn('user', 'email', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }, // Note: This is model-level, not DB-level
      });
    } else {
      // Check if UNIQUE constraint exists, add if missing
      const constraints = await queryInterface.showConstraint('user');
      const hasUniqueEmail = constraints.some(
        (c) => c.constraintName.includes('email') && c.constraintType === 'UNIQUE'
      );
      if (!hasUniqueEmail) {
        await queryInterface.addConstraint('user', {
          fields: ['email'],
          type: 'unique',
          name: 'user_email_unique',
        });
      }
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('user', 'email');
  },
};