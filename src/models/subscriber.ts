import {
  Model, DataTypes, HasManyGetAssociationsMixin, HasOneGetAssociationMixin,
} from 'sequelize';
import { sequelize } from './sequelize';
import { dbType } from './index';

import Token from './token';
import ReceivingOption from './receiving_option';

class Subscriber extends Model {
  public readonly subscriberId!: number;

  public email!: string;

  public password!: string;

  public isVerified!: boolean;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;

  public getTokens!: HasManyGetAssociationsMixin<Token>;

  public getReceivingOption!: HasOneGetAssociationMixin<ReceivingOption>;
}

Subscriber.init({
  subscriberId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Subscriber',
  tableName: 'subscribers',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

export const associate = (db: dbType) => {
  Subscriber.hasMany(db.Token, { foreignKey: 'subscriberId' });
  Subscriber.hasOne(db.ReceivingOption, { foreignKey: 'subscriberId' });
  Subscriber.hasOne(db.Permission, { foreignKey: 'subscriberId' });
};

export default Subscriber;
