module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID
    },
    followerId: {
      type: DataTypes.UUID
    },
  });

  Follow.associate = (models) => {
    Follow.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'userDetails',
      onDelete: 'CASCADE'
    });

    Follow.belongsTo(models.User, {
      foreignKey: 'followerId',
      as: 'followerDetails',
      onDelete: 'CASCADE'
    });
  };
  return Follow;
};
