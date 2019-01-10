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
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Image cannot be null, enter true or false!'
        },
      }
    },

    bio: {
      type: DataTypes.STRING,
      allowNull: false
    }

  });
  Profile.associate = (models) => {
    Profile.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };
  return Profile;
};
