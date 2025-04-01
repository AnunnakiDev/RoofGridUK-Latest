module.exports = (sequelize, DataTypes) => {
  const PasswordResetToken = sequelize.define('passwordResetToken', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'passwordResetToken',
    timestamps: true,
  });

  PasswordResetToken.associate = (models) => {
    PasswordResetToken.belongsTo(models.user, { foreignKey: 'userId' });
  };

  return PasswordResetToken;
};