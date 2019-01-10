module.exports = (sequelize, DataTypes) => {
  const Profile = sequelize.define('Profile', {

    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    imageUrl: {
      type: DataTypes.STRING
    },

    bio: {
      type: DataTypes.TEXT
    }

  });
  Profile.associate = (models) => {
    Profile.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };
  return Profile;
};
