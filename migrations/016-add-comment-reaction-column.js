module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .createTable('commentReactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      commentId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Comments',
          key: 'id'
        }
      },
      commentLikedBy: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      liked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      disliked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
  down: queryInterface => queryInterface.dropTable('commentReactions')
};
