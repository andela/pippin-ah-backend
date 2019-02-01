import bcrypt from 'bcrypt';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING
    },
    isMentor: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    resetToken: {
      type: DataTypes.STRING
    },
    tokenExpires: {
      type: DataTypes.INTEGER
    }
  }, {
    hooks: {
      beforeCreate: user => user.password && user.hashPassword(),
      beforeUpdate: user => user.password && user.hashPassword()
    }
  }
  );

  User.associate = (models) => {
    User.hasOne(models.Profile, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    User.hasMany(models.Report, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    User.hasMany(models.Notification, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });

    User.hasMany(models.Follow, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'followerDetails'
    });

    User.hasMany(models.Follow, {
      foreignKey: 'followerId',
      onDelete: 'CASCADE',
      as: 'userDetails'
    });

    User.hasMany(models.Article, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };


  User.prototype.hashPassword = async function hashPassword() {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    return this.password;
  };

  User.prototype.validPassword = function validPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};
