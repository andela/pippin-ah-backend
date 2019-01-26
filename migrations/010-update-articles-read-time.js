module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .addColumn('Articles', 'readTime', {
      type: Sequelize.INTEGER
    }),

  /* eslint-disable no-unused-vars */
  down: (queryInterface, Sequelize) => queryInterface
    .removeColumn('Articles', 'readTime')
};
