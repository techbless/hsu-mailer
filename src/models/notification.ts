import { Model, DataTypes } from 'sequelize';
import { sequelize } from './sequelize';
import { dbType } from './index';

class Notification extends Model {
  public readonly notificationId!: number;

  public webpostIdx!: number;

  public notificationType!: string;

  public title!: string;

  public link!: string;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

Notification.init({
  notificationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  webpostIdx: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  notificationType: {
    type: DataTypes.STRING(20),
  },
  title: {
    type: DataTypes.STRING(150),
  },
  link: {
    type: DataTypes.STRING(750),
  },
}, {
  sequelize,
  modelName: 'Notification',
  tableName: 'notifications',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

export const associate = (db: dbType) => {

};

export default Notification;
