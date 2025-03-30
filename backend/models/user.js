const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
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
      validate: {
        isIn: [['admin', 'user']], // Enforce valid values
      },
    },
    subscription: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'basic',
      validate: {
        isIn: [['basic', 'pro']], // Enforce valid values
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Validates email format
      },
    },
  }, {
    tableName: 'user',
    timestamps: true,
  });

  return User;
};