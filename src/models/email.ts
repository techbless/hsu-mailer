import { Model, DataTypes } from 'sequelize';
import { sequelize } from './sequelize';
import { dbType } from './index';

class Email extends Model {
    public readonly emailId!: number;

    public email!: string;

    public isAuthenticated!: boolean;

    public readonly createdAt!: Date;

    public readonly updatedAt!: Date;
}

Email.init({
  emailId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  isAuthenticated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Email',
  tableName: 'emails',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

export const associate = (db: dbType) => {
  Email.hasMany(db.Token);
};

export default Email;
