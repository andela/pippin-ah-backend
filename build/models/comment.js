'use strict';

module.exports = function (sequelize, DataTypes) {
  var Comment = sequelize.define('Comment', {
    comment: {
      type: DataTypes.STRING,
      allowNull: false
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  Comment.associate = function (models) {
    Comment.belongsTo(models.Article, {
      foreignKey: 'articleId'
    });
  };
  return Comment;
};
//# sourceMappingURL=comment.js.map