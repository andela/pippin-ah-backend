const tableName = 'Users';

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(tableName, 'resetToken', {
      type: Sequelize.String,
      allowNull: true
    }),
    queryInterface.addColumn(tableName, 'tokenExpires', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
  ]),

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn(tableName, 'resetToken'),
    queryInterface.removeColumn(tableName, 'tokenExpires')
  ])
};
