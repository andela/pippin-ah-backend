const tableName = 'Articles';

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn(tableName, 'rating', {
      type: Sequelize.JSON,
      allowNull: true
    }),
    queryInterface.addColumn(tableName, 'aveRating', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
  ]),

  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn(tableName, 'rating'),
    queryInterface.removeColumn(tableName, 'aveRating')
  ])
};
