'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    username:{ 
      type:DataTypes.STRING,
      unique: true,
      validate: {
        isUnique(value, next) {
          const self = this;
          user.find({ where: { username: value } })
            .then((users) => {
              if (users && self.id !== users.id) {
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
              user.find({ where: { email: value } })
                .then((users) => {
                  if (users && self.id !== users.id) {
                    return next('Email already in use!');
                  }
                  return next();
                })
                .catch(err => next(err));
            }
          }
  },
  password: {
    type: DataTypes.STRING
  },
  }, {});
  user.associate = function(models) {
    // associations can be defined here
  };
  return user;
};