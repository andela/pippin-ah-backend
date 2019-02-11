module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .addColumn('Article', 'coverImageUrl', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }),
  // eslint-disable-next-line no-unused-vars
  down: (queryInterface, Sequelize) => queryInterface
    .removeColumn('Article', 'coverImageUrl')
};
