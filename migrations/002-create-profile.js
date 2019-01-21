module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Profiles', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    bio: {
      type: Sequelize.TEXT
    },
    imageUrl: {
      type: Sequelize.STRING
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
        as: 'userId'
      }
    },
    category: {
      type: Sequelize.ENUM,
      values: ['Science', 'Technology', 'Engineering', 'Arts', 'Mathematics']
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
  down: queryInterface => queryInterface.dropTable('Profiles')
};
