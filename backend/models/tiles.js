module.exports = (sequelize, DataTypes) => {
  const Tile = sequelize.define('tile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    crossbonded: {
      type: DataTypes.ENUM('YES', 'NO'),
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
    tableName: 'tile',
    timestamps: true,
  });

  // No associations for Tile model
  Tile.associate = (models) => {
    // No relationship with userTile, as userTile represents custom tiles, not references to default tiles
  };

  return Tile;
};