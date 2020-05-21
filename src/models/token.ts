import { Model, DataTypes } from 'sequelize';
import { sequelize } from './sequelize';
import { dbType } from './index';

class Token extends Model {
    public readonly tokenId!: number;

    public token!: string;

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
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  modelName: 'Token',
  tableName: 'tokens',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

export const associate = (db: dbType) => {
  Token.belongsTo(db.Email);
};

export default Token;
