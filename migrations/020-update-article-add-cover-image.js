module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .addColumn('Articles', 'coverImageUrl', {
      type: Sequelize.STRING
    }),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface
    .removeColumn('Articles', 'coverImageUrl')
};
