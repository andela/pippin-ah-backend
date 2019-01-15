'use strict';

module.exports = function (sequelize, DataTypes) {
  var Article = sequelize.define('Article', {
    post: {
      type: DataTypes.STRING,
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    dislikes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    }

  });

  Article.associate = function (models) {
    Article.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    Article.hasMany(models.Comment, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });

    Article.hasMany(models.Report, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE'
    });
  };
  return Article;
};