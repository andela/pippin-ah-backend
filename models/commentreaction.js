module.exports = (sequelize, DataTypes) => {
  const CommentReaction = sequelize.define('CommentReaction', {
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

  CommentReaction.associate = (models) => {
    CommentReaction.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE'
    });

    CommentReaction.belongsTo(models.User, {
      foreignKey: 'commentLikedBy',
      onDelete: 'CASCADE'
    });
  };
  return CommentReaction;
};
