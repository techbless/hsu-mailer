/* eslint-disable quote-props */
/* eslint-disable quotes */
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  "development": {
    "username": process.env.MYSQL_USER!,
    "password": process.env.MYSQL_PASSWORD!,
    "database": process.env.MYSQL_DATABASE!,
    "host": process.env.MYSQL_HOST!,
    "dialect": 'mysql',
    logging: false,
  },
  "test": {
    "username": process.env.MYSQL_USER!,
    "password": process.env.MYSQL_PASSWORD!,
    "database": process.env.MYSQL_DATABASE!,
    "host": process.env.MYSQL_HOST!,
    "dialect": 'mysql',
    logging: false,
  },
  "production": {
    "username": process.env.MYSQL_USER!,
    "password": process.env.MYSQL_PASSWORD!,
    "database": process.env.MYSQL_DATABASE!,
    "host": process.env.MYSQL_HOST!,
    "dialect": 'mysql',
    logging: false,
  },
};
