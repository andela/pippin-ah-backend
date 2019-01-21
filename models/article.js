module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
<<<<<<< HEAD
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
=======
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    title: {
>>>>>>> 163a4fd455af89201b3c6bdf659921e61b3e3ae9
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Article.associate = (models) => {
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
