module.exports = (sequelize, DataTypes) => {
    const Enrollment = sequelize.define('Enrollment', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      courseId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });
  
    Enrollment.associate = (models) => {
      Enrollment.belongsTo(models.User, { foreignKey: 'userId' });
      Enrollment.belongsTo(models.Course, { foreignKey: 'courseId' });
    };
  
    return Enrollment;
  };
  