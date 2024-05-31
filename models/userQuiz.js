module.exports = (sequelize, DataTypes) => {
    const UserQuiz = sequelize.define('UserQuiz', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      quizId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });
  
    UserQuiz.associate = (models) => {
      UserQuiz.belongsTo(models.User, { foreignKey: 'userId' });
      UserQuiz.belongsTo(models.Quiz, { foreignKey: 'quizId' });
    };
  
    return UserQuiz;
  };
  