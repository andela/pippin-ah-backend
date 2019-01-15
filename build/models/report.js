'use strict';

module.exports = function (sequelize, DataTypes) {
  var Report = sequelize.define('Report', {
    report: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  return Report;
};