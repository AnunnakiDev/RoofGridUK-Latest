module.exports = (sequelize, DataTypes) => {
  const userTile = sequelize.define('userTile', {
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
    eave_tile_length: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    headlap: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    crossBonded: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    minGauge: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxGauge: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    minSpacing: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxSpacing: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    datasheet_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  userTile.associate = (models) => {
    userTile.belongsTo(models.user, { foreignKey: 'userId' }); // Already lowercase 'user'
  };

  return userTile;
};