module.exports = (sequelize, DataTypes) => {
  const Bookmark = sequelize.define('Reaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    articleId: {
      type: DataTypes.UUID
    },
    bookmarkedBy: {
      type: DataTypes.UUID
    },
    bookmarked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Bookmark.associate = (models) => {
    Bookmark.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });

    Bookmark.belongsTo(models.User, {
      foreignKey: 'bookmarkedBy',
      onDelete: 'CASCADE'
    });
  };
  return Bookmark;
};
