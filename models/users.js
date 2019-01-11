module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true

    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false

    },
    isMentor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  });
  User.associate = models => User.hasOne(models.Profile, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });
  return User;
};
