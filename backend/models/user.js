module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
    },
    subscription: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'basic',
    },
  }, {
    tableName: 'user',
    timestamps: true,
  });

  User.associate = (models) => {
    User.hasMany(models.project, { foreignKey: 'userId' });
    User.hasMany(models.userTile, { foreignKey: 'userId' });
    User.hasMany(models.passwordResetToken, { foreignKey: 'userId' });
  };

  return User;
};