const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: '****', //mysql username
  password: '********', //password
  database: 'RESTAPI_userdb' //database_name
});

module.exports = pool.promise();