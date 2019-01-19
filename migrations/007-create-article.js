const tableName = 'Articles';

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn(tableName, 'post'),

    queryInterface.addColumn(tableName, 'title', {
      type: Sequelize.STRING,
      allowNull: false
    }),

    queryInterface.addColumn(tableName, 'body', {
      type: Sequelize.STRING,
      allowNull: true
    }),

    queryInterface.addColumn(tableName, 'description', {
      type: Sequelize.STRING,
      allowNull: true
    }),

    queryInterface.addColumn(tableName, 'tags', {
      type: Sequelize.STRING,
      allowNull: true
    }),

    queryInterface.addColumn(tableName, 'slug', {
      type: Sequelize.STRING,
      allowNull: true
    })
  ]),

  /* eslint-disable no-unused-vars */
  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn(tableName, 'slug'),
    queryInterface.removeColumn(tableName, 'tags')
  ])
};
