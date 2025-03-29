const userTile = (sequelize, DataTypes) => {
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
    },
    mingauge: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 75, // Default value to match client-side default
    },
    maxgauge: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 325, // Default value to match client-side default
    },
    minspacing: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 3, // Default value to match client-side default
    },
    maxspacing: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 7, // Default value to match client-side default
    },
    lhTileWidth: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  UserTile.associate = (models) => {
    UserTile.belongsTo(models.user, { foreignKey: 'userId' });
  };

  return UserTile;
};

module.exports = userTile;