module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Requests', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    userId: {
      allowNull: false,
      type: Sequelize.UUID
    },
    request: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.ENUM,
      values: ['approved', 'pending', 'rejected']
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('Requests')
};
