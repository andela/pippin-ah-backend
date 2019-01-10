module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    comment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  });
  Comment.associate = (models) => {
    Comment.belongsTo(models.article, {
      foreignKey: 'articleId'
    });
  };
  return Comment;
};
