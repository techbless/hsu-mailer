import Subscriber, { associate as associateSubscriber } from './subscriber';
import Token, { associate as associateToken } from './token';
import Notification, { associate as associateNotification } from './notification';
import ReceivingOption, { associate as associateReceivingOption } from './receiving_option';
import Permission, { associate as associatePermission } from './permission';

export * from './sequelize';

const db = {
  Subscriber,
  Token,
  Notification,
  ReceivingOption,
  Permission,
};

export type dbType = typeof db;

associateSubscriber(db);
associateToken(db);
associateNotification(db);
associateReceivingOption(db);
associatePermission(db);
