import Subscriber, { associate as associateSubscriber } from './subscriber';
import Token, { associate as associateToken } from './token';
import Notification, { associate as associateNotification } from './notification';

export * from './sequelize';

const db = {
  Subscriber,
  Token,
  Notification,
};

export type dbType = typeof db;

associateSubscriber(db);
associateToken(db);
associateNotification(db);
