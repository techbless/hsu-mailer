const mysql = require('mysql');
const { promisify } = require('util');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  connectionLimit: 10
});

const _query = promisify(pool.query).bind(pool);

function getConnection() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, conn) => {
      if(err) {
        reject(err);
      } else {
        resolve(conn);
      }
    });
  });
}

module.exports = {
  _query: _query,
  getConnection: getConnection
};