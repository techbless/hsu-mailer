import Subscriber, { associate as associateSubscriber } from './subscriber';
import Token, { associate as associateToken } from './token';

export * from './sequelize';

const db = {
  Subscriber,
  Token,
};

export type dbType = typeof db;

associateSubscriber(db);
associateToken(db);
