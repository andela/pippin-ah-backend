module.exports = (sequelize, DataTypes) => {
  const Connection = sequelize.define('Connection', {
    userId: {
      type: DataTypes.INTEGER
    },
    followerId: {
      type: DataTypes.INTEGER
    },
  });
  Connection.associate = (models) => {
    Connection.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Connection;
};
