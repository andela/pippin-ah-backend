module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .changeColumn('Articles', 'tags', {
      type: `${Sequelize.ARRAY(Sequelize.STRING)}USING CAST("tags" as 
      ${Sequelize.ARRAY(Sequelize.STRING)})`
    }),
  down: (queryInterface, Sequelize) => queryInterface
    .changeColumn('Articles', 'tags', {
      type: Sequelize.TEXT
    })
};
