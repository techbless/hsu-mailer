import Subscriber, { associate as associateSubscriber } from './subscriber';
import Token, { associate as associateToken } from './token';
import Notification, { associate as associateNotification } from './notification';
import ReceivingDays, { associate as associateReceivingDays } from './receiving_days';
import Permission, { associate as associatePermission } from './permission';

export * from './sequelize';

const db = {
  Subscriber,
  Token,
  Notification,
  ReceivingDays,
  Permission,
};

export type dbType = typeof db;

associateSubscriber(db);
associateToken(db);
associateNotification(db);
associateReceivingDays(db);
associatePermission(db);
