module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .addColumn(
      'Articles',
      'readTime',
      Sequelize.INTEGER
    ),

  /* eslint-disable no-unused-vars */
  down: (queryInterface, Sequelize) => queryInterface
    .remove('Articles', 'readTime')
};
