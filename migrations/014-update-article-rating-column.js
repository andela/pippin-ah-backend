const tableName = 'Articles';

module.exports = {
  // eslint-disable-next-line no-unused-vars
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn(tableName, 'rating')
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(tableName, 'rating', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
  ])
};
