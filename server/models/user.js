'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username:{ 
      type:DataTypes.STRING,
      unique: true,
      validate: {
        isUnique(value, next) {
          const self = this;
          User.find({ where: { username: value } })
            .then((user) => {
              if (user && self.id !== user.id) {
                return next('Username already in use!');
              }
              return next();
            })
            .catch(err => next(err));
        }
      }
    },
    email: {
          type:DataTypes.STRING, 
          unique: true,
          validate: {
            isUnique(value, next) {
              const self = this;
              User.find({ where: { email: value } })
                .then((user) => {
                  if (user && self.id !== user.id) {
                    return next('Email already in use!');
                  }
                  return next();
                })
                .catch(err => next(err));
            }
          }
  },
  bio: {
    type:DataType.STRING
  },
  image: {
    type:DataType.STRING
  },
  favorites: { type:DataTypes.ARRAY(DataTypes.DECIMAL)},
  following:{ type: DataTypes.ARRAY(DataTypes.DECIMAL)},
  hash:{
    type:DataType.STRING
  },
  salt:{
    type:DataType.STRING
  },
  }, {});
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};