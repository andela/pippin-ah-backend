module.exports = (sequelize, DataTypes) => {
  const connection = sequelize.define('Connection', {
    followerId: {
      type: DataTypes.INTEGER
    },
    followedId: {
      type: DataTypes.INTEGER
    }
  });
  return connection;
};
