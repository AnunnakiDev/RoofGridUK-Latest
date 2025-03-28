module.exports = (sequelize, DataTypes) => {
  const Tile = sequelize.define('tile', {
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
    crossbonded: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mingauge: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxgauge: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    minspacing: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    maxspacing: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    datasheet_link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lhTileWidth: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
  }, {
    tableName: 'tile', // Explicitly set the table name
  });

  return Tile;
};