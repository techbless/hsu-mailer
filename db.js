var mysql = require('mysql');
var config = require('./db-config.json')

var conn = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  multipleStatements: true
});

conn.connect(function(err) {
  if (err) throw err;
  console.log("MySQL - Connected!");
});

module.exports = conn;
