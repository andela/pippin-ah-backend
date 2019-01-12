module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('Report', {
    report: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false

    },
  });
    // Report.associate = models => Report.hasOne(models.Profile, {

  // });
  // Report.associate = models => {

  // };
  return Report;
};
