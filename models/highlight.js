module.exports = (sequelize, DataTypes) => {
  const Highlight = sequelize.define('Highlight', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    articleId: {
      type: DataTypes.UUID
    },
    userId: {
      type: DataTypes.UUID
    },
    highlightedText: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startIndex: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    stopIndex: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
    }
  });

  Highlight.associate = (models) => {
    Highlight.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });

    Highlight.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Highlight;
};
