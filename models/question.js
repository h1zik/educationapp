module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define('Question', {
      text: {
        type: DataTypes.STRING,
        allowNull: false
      },
      options: {
        type: DataTypes.JSON,
        allowNull: false
      },
      answer: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      quizId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });
  
    Question.associate = (models) => {
      Question.belongsTo(models.Quiz, { foreignKey: 'quizId' });
    };
  
    return Question;
  };
  