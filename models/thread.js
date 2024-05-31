module.exports = (sequelize, DataTypes) => {
    const Thread = sequelize.define('Thread', {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    });
  
    Thread.associate = (models) => {
      Thread.hasMany(models.Comment, { onDelete: 'CASCADE' });
      Thread.belongsTo(models.User);
    };
  
    return Thread;
  };
  