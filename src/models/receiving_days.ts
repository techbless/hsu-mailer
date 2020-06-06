import { Model, DataTypes, HasManyGetAssociationsMixin } from 'sequelize';
import { sequelize } from './sequelize';
import { dbType } from './index';

class ReceivingDays extends Model {
  public subscriberId!: number;

  public sunday!: boolean;

  public monday!: boolean;

  public tuesday!: boolean;

  public wednesday!: boolean;

  public thursday!: boolean;

  public friday!: boolean;

  public saturday!: boolean;

  public readonly createdAt!: Date;

  public readonly updatedAt!: Date;
}

ReceivingDays.init({
  sunday: {
    type: DataTypes.BOOLEAN,
  },
  monday: {
    type: DataTypes.BOOLEAN,
  },
  tuesday: {
    type: DataTypes.BOOLEAN,
  },
  wednesday: {
    type: DataTypes.BOOLEAN,
  },
  thursday: {
    type: DataTypes.BOOLEAN,
  },
  friday: {
    type: DataTypes.BOOLEAN,
  },
  saturday: {
    type: DataTypes.BOOLEAN,
  },
}, {
  sequelize,
  modelName: 'ReceivingDays',
  tableName: 'receivingDays',
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
});

export const associate = (db: dbType) => {
  ReceivingDays.belongsTo(db.Subscriber, { foreignKey: 'subscriberId' });
};

export default ReceivingDays;
