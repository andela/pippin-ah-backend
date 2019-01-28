module.exports = (sequelize, DataTypes) => {
  const Commentreaction = sequelize.define('Commentreaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    commentId: {
      type: DataTypes.UUID
    },
    commentLikedBy: {
      type: DataTypes.UUID
    },
    liked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    disliked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Commentreaction.associate = (models) => {
    Commentreaction.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });

    Commentreaction.belongsTo(models.User, {
      foreignKey: 'commentLikedBy',
      onDelete: 'CASCADE'
    });
  };
  return Commentreaction;
};
