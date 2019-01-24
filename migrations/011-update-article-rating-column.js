const tableName = 'Articles';

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn(tableName, 'rating'),

    queryInterface.addColumn(tableName, 'rating', {
      type: Sequelize.JSON,
      allowNull: true
    }),
    queryInterface.addColumn(tableName, 'aveRating', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn(tableName, 'rating'),
    queryInterface.removeColumn(tableName, 'aveRating'),

    queryInterface.addColumn(tableName, 'rating', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
  ])
};
