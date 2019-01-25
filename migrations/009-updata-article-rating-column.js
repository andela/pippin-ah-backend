const tableName = 'Articles';

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn(tableName, 'rating'),

    queryInterface.addColumn(tableName, 'rating', {
      type: Sequelize.JSON,
      allowNull: true
    })
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn(tableName, 'rating'),

    queryInterface.addColumn(tableName, 'rating', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
  ])
};
