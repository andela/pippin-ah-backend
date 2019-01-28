/* eslint-disable no-unused-vars */

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .removeColumn('Comments', 'comment'),

  down: (queryInterface, Sequelize) => queryInterface
    .addColumn('Comments', 'comment', { type: Sequelize.STRING })
};
