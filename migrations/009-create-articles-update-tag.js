module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .changeColumn('Articles', 'tags', {
      type: `${Sequelize.ARRAY(Sequelize.TEXT)}USING CAST("tags" as 
      ${Sequelize.ARRAY(Sequelize.TEXT)})`
    }),
  down: (queryInterface, Sequelize) => queryInterface
    .changeColumn('Articles', 'tags', {
      type: Sequelize.TEXT
    })
};
