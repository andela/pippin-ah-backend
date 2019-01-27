const tableName = 'Users';
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .addColumn(tableName, 'isAdmin', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface
    .removeColumn(tableName, 'isAdmin')
};
