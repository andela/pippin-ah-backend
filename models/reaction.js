module.exports = (sequelize, DataTypes) => {
  const Reaction = sequelize.define('Reaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    articleId: {
      type: DataTypes.UUID
    },
    likedOrDislikedBy: {
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

  Reaction.associate = (models) => {
    Reaction.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });

    Reaction.belongsTo(models.User, {
      foreignKey: 'likedOrDislikedBy',
      onDelete: 'CASCADE'
    });
  };
  return Reaction;
};
