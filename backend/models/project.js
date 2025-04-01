module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('project', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    projectName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rafterHeights: {
      type: DataTypes.JSON,
    },
    widths: {
      type: DataTypes.JSON,
    },
    settings: {
      type: DataTypes.JSON,
    },
    verticalResults: {
      type: DataTypes.JSON,
    },
    horizontalResults: {
      type: DataTypes.JSON,
    },
    totalResults: {
      type: DataTypes.JSON,
    },
  }, {
    tableName: 'project',
    timestamps: true,
  });

  Project.associate = (models) => {
    Project.belongsTo(models.user, { foreignKey: 'userId' });
  };

  return Project;
};