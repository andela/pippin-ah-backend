/* eslint-disable no-unused-vars */

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .addColumn('Comments', 'comment', { type: Sequelize.JSON }),

  down: (queryInterface, Sequelize) => queryInterface
    .removeColumn('Comments', 'comment')
};
