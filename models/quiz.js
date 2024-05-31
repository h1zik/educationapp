module.exports = (sequelize, DataTypes) => {
    const Quiz = sequelize.define('Quiz', {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      contentId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });
  
    Quiz.associate = (models) => {
      Quiz.belongsTo(models.Content, { foreignKey: 'contentId' });
      Quiz.belongsTo(models.Course, { foreignKey: 'courseId' });
      Quiz.hasMany(models.Question, { foreignKey: 'quizId' });
    };
  
    return Quiz;
  };
  