module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false
      },
      read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    });
  
    Notification.associate = (models) => {
      Notification.belongsTo(models.User, { foreignKey: 'userId', as: 'User' });
    };
  
    return Notification;
  };
  