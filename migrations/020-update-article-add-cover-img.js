module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .addColumn('Articles', 'coverImageUrl', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface
    .removeColumn('Articles', 'coverImageUrl')
};
