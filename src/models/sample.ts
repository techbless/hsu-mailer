import { Model, DataTypes } from 'sequelize';
import { sequelize } from './sequelize';
import { dbType } from './index';

class Sample extends Model {
    public readonly userId!: number;

    public readonly createdAt!: Date;

    public readonly updatedAt!: Date;
}

Sample.init({
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
}, {
  sequelize,
  modelName: 'Sample',
  tableName: 'samples',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

export const associate = (db: dbType) => {

};

export default User;
