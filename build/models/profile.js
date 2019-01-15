'use strict';

module.exports = function (sequelize, DataTypes) {
  var Profile = sequelize.define('Profile', {

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
    },
    category: {
      type: DataTypes.ENUM,
      values: ['Science', 'Technology', 'Engineering', 'Arts', 'Mathematics']
    }

  });
  Profile.associate = function (models) {
    Profile.belongsTo(models.User, {
      foreignKey: 'userId'
    });
  };
  return Profile;
};