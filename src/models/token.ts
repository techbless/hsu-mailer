import { Model, DataTypes } from 'sequelize';
import { sequelize } from './sequelize';
import { dbType } from './index';

export type Purpose = 'subscribe' | 'unsubscribe' | 'password' | null;

class Token extends Model {
    public readonly tokenId!: number;

    public subscriberId!: number;

    public token!: string;

    public purpose!: Purpose;

    public readonly createdAt!: Date;

    public readonly updatedAt!: Date;
}

Token.init({
  tokenId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: DataTypes.STRING(128),
    allowNull: false,
    unique: false,
  },
  purpose: {
    type: DataTypes.STRING(25),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Token',
  tableName: 'tokens',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

export const associate = (db: dbType) => {
  Token.belongsTo(db.Subscriber, { as: 'subscriber', foreignKey: 'subscriberId' });
};

export default Token;
