module.exports = (sequelize, DataTypes) => {
    const UserCourseProgress = sequelize.define('UserCourseProgress', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      quizzesCompleted: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      totalQuizzes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    });
  
    UserCourseProgress.associate = (models) => {
      UserCourseProgress.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
      UserCourseProgress.belongsTo(models.Course, { foreignKey: 'courseId', onDelete: 'CASCADE' });
    };
  
    return UserCourseProgress;
  };
