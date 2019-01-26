const tableName = 'Users';

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(tableName, 'isAdmin', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }),
  ]),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn(tableName, 'isAdmin')
  ])
};
