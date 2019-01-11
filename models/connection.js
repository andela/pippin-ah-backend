export default (sequelize, DataTypes) => {
  const follow = sequelize.define('Follow', {
    userId: {
      type: DataTypes.INTEGER
    },
    followerUserId: {
      type: DataTypes.INTEGER
    }
  }, {});
  return follow;
};
