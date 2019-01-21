module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    imageUrl: {
      type: DataTypes.STRING
    },
    bio: {
      type: DataTypes.TEXT
    },
    category: {
      type: DataTypes.ENUM,
      values: ['Science', 'Technology', 'Engineering', 'Arts', 'Mathematics']
    },

  });
  Profile.associate = (models) => {
    Profile.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };
  return Profile;
};
