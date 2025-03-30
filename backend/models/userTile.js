const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const UserTile = sequelize.define('userTile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    length: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    crossbonded: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['YES', 'NO']],
      },
    },
    mingauge: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 75,
    },
    maxgauge: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 325,
    },
    minspacing: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 3,
    },
    maxspacing: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 7,
    },
    lhTileWidth: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'userTile',
    timestamps: true,
  });

  UserTile.associate = (models) => {
    UserTile.belongsTo(models.user, { foreignKey: 'userId' });
  };

  return UserTile;
};