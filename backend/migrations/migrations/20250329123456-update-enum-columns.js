'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Update user.role
    // Ensure all existing role values are valid ('admin' or 'user')
    await queryInterface.sequelize.query(`
      UPDATE "user"
      SET "role" = 'user'
      WHERE "role" IS NULL OR "role" NOT IN ('admin', 'user');
    `);

    // Drop the default value, create the ENUM, alter the column, and set the new default
    await queryInterface.sequelize.query('ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;');
    await queryInterface.sequelize.query('CREATE TYPE "enum_user_role" AS ENUM (\'admin\', \'user\');');
    await queryInterface.sequelize.query('ALTER TABLE "user" ALTER COLUMN "role" TYPE "enum_user_role" USING ("role"::text::enum_user_role);');
    await queryInterface.sequelize.query('ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT \'user\';');

    // Step 2: Update user.subscription
    // Ensure all existing subscription values are valid ('basic' or 'pro')
    await queryInterface.sequelize.query(`
      UPDATE "user"
      SET "subscription" = 'basic'
      WHERE "subscription" IS NULL OR "subscription" NOT IN ('basic', 'pro');
    `);

    // Drop the default value, create the ENUM, alter the column, and set the new default
    await queryInterface.sequelize.query('ALTER TABLE "user" ALTER COLUMN "subscription" DROP DEFAULT;');
    await queryInterface.sequelize.query('CREATE TYPE "enum_user_subscription" AS ENUM (\'basic\', \'pro\');');
    await queryInterface.sequelize.query('ALTER TABLE "user" ALTER COLUMN "subscription" TYPE "enum_user_subscription" USING ("subscription"::text::enum_user_subscription);');
    await queryInterface.sequelize.query('ALTER TABLE "user" ALTER COLUMN "subscription" SET DEFAULT \'basic\';');

    // Step 3: Update tile.crossbonded
    // Ensure all existing crossbonded values are valid ('YES' or 'NO')
    await queryInterface.sequelize.query(`
      UPDATE "tile"
      SET "crossbonded" = 'NO'
      WHERE "crossbonded" IS NULL OR "crossbonded" NOT IN ('YES', 'NO');
    `);

    // Drop the default value, create the ENUM, and alter the column
    await queryInterface.sequelize.query('ALTER TABLE "tile" ALTER COLUMN "crossbonded" DROP DEFAULT;');
    await queryInterface.sequelize.query('CREATE TYPE "enum_tile_crossbonded" AS ENUM (\'YES\', \'NO\');');
    await queryInterface.sequelize.query('ALTER TABLE "tile" ALTER COLUMN "crossbonded" TYPE "enum_tile_crossbonded" USING ("crossbonded"::text::enum_tile_crossbonded);');

    // Step 4: Update userTile.crossbonded
    // Ensure all existing crossbonded values are valid ('YES' or 'NO')
    await queryInterface.sequelize.query(`
      UPDATE "userTile"
      SET "crossbonded" = 'NO'
      WHERE "crossbonded" IS NULL OR "crossbonded" NOT IN ('YES', 'NO');
    `);

    // Drop the default value, create the ENUM, and alter the column
    await queryInterface.sequelize.query('ALTER TABLE "userTile" ALTER COLUMN "crossbonded" DROP DEFAULT;');
    await queryInterface.sequelize.query('CREATE TYPE "enum_userTile_crossbonded" AS ENUM (\'YES\', \'NO\');');
    await queryInterface.sequelize.query('ALTER TABLE "userTile" ALTER COLUMN "crossbonded" TYPE "enum_userTile_crossbonded" USING ("crossbonded"::text::enum_userTile_crossbonded);');
  },

  async down(queryInterface, Sequelize) {
    // Revert user.role
    await queryInterface.sequelize.query('ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;');
    await queryInterface.sequelize.query('ALTER TABLE "user" ALTER COLUMN "role" TYPE TEXT USING ("role"::text);');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_user_role";');
    await queryInterface.sequelize.query('ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT \'user\';');

    // Revert user.subscription
    await queryInterface.sequelize.query('ALTER TABLE "user" ALTER COLUMN "subscription" DROP DEFAULT;');
    await queryInterface.sequelize.query('ALTER TABLE "user" ALTER COLUMN "subscription" TYPE TEXT USING ("subscription"::text);');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_user_subscription";');
    await queryInterface.sequelize.query('ALTER TABLE "user" ALTER COLUMN "subscription" SET DEFAULT \'free\';');

    // Revert tile.crossbonded
    await queryInterface.sequelize.query('ALTER TABLE "tile" ALTER COLUMN "crossbonded" DROP DEFAULT;');
    await queryInterface.sequelize.query('ALTER TABLE "tile" ALTER COLUMN "crossbonded" TYPE TEXT USING ("crossbonded"::text);');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_tile_crossbonded";');

    // Revert userTile.crossbonded
    await queryInterface.sequelize.query('ALTER TABLE "userTile" ALTER COLUMN "crossbonded" DROP DEFAULT;');
    await queryInterface.sequelize.query('ALTER TABLE "userTile" ALTER COLUMN "crossbonded" TYPE TEXT USING ("crossbonded"::text);');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_userTile_crossbonded";');
  }
};