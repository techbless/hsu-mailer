var mysql = require('mysql');

var conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "as12df34%.",
  database: "hsu",
  multipleStatements: true
});

conn.connect(function(err) {
  if (err) throw err;
  console.log("MySQL - Connected!");
});

module.exports = conn;
