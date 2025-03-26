module.exports = (sequelize, DataTypes) => {
    const project = sequelize.define('project', {
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
        allowNull: false,
      },
      widths: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      settings: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      verticalResults: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      horizontalResults: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      totalResults: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    });
  
    project.associate = (models) => {
      project.belongsTo(models.user, { foreignKey: 'userId' }); // Already lowercase 'user'
    };
  
    return project;
  };