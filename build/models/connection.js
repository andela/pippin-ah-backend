'use strict';

module.exports = function (sequelize, DataTypes) {
  var Connection = sequelize.define('Connection', {
    userId: {
      type: DataTypes.INTEGER
    },
    followerId: {
      type: DataTypes.INTEGER
    }
  });
  Connection.associate = function (models) {
    Connection.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };
  return Connection;
};
//# sourceMappingURL=connection.js.map