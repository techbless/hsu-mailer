import Email, { associate as associateEmail } from './email';
import Token, { associate as associateToken } from './token';

export * from './sequelize';

const db = {
  Email,
  Token,
};

export type dbType = typeof db;

associateEmail(db);
associateToken(db);
