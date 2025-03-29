'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Step 1: Update existing null values to defaults
      await queryInterface.sequelize.query(
        `UPDATE "userTile" SET "mingauge" = 75 WHERE "mingauge" IS NULL;`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `UPDATE "userTile" SET "maxgauge" = 325 WHERE "maxgauge" IS NULL;`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `UPDATE "userTile" SET "minspacing" = 3 WHERE "minspacing" IS NULL;`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `UPDATE "userTile" SET "maxspacing" = 7 WHERE "maxspacing" IS NULL;`,
        { transaction }
      );

      // Step 2: Change column definitions
      await queryInterface.changeColumn(
        'userTile',
        'mingauge',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 75,
        },
        { transaction }
      );
      await queryInterface.changeColumn(
        'userTile',
        'maxgauge',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 325,
        },
        { transaction }
      );
      await queryInterface.changeColumn(
        'userTile',
        'minspacing',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 3,
        },
        { transaction }
      );
      await queryInterface.changeColumn(
        'userTile',
        'maxspacing',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 7,
        },
        { transaction }
      );

      // Step 3: Remove unused columns
      await queryInterface.removeColumn('userTile', 'headlap', { transaction });
      await queryInterface.removeColumn('userTile', 'eave_tile_length', { transaction });
      await queryInterface.removeColumn('userTile', 'datasheet_link', { transaction });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Re-add removed columns
      await queryInterface.addColumn(
        'userTile',
        'headlap',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'userTile',
        'eave_tile_length',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'userTile',
        'datasheet_link',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction }
      );

      // Revert column changes to non-nullable
      await queryInterface.changeColumn(
        'userTile',
        'mingauge',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        { transaction }
      );
      await queryInterface.changeColumn(
        'userTile',
        'maxgauge',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        { transaction }
      );
      await queryInterface.changeColumn(
        'userTile',
        'minspacing',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        { transaction }
      );
      await queryInterface.changeColumn(
        'userTile',
        'maxspacing',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        { transaction }
      );
    });
  },
};