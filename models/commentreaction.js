module.exports = (sequelize, DataTypes) => {
  const commentReaction = sequelize.define('commentReaction', {
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

  commentReaction.associate = (models) => {
    commentReaction.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });

    commentReaction.belongsTo(models.User, {
      foreignKey: 'commentLikedBy',
      onDelete: 'CASCADE'
    });
  };
  return commentReaction;
};
