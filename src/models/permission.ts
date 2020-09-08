import {
  Model, DataTypes,
} from 'sequelize';
import { sequelize } from './sequelize';
import { dbType } from './index';

class Permission extends Model {
  public readonly subscriberId!: number;

  public broadcast!: boolean;

  public userManagement!: boolean;
}

Permission.init({
  subscriberId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  broadcast: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  userManagement: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Permission',
  tableName: 'permissions',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

export const associate = (db: dbType) => {
  Permission.belongsTo(db.Subscriber, { foreignKey: 'subscriberId' });
};

export default Permission;
