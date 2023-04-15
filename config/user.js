const creds = {
  //create a bunh (pool) of potential connections for multipule users
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : '',
  database        : 'roku_temp',
  port            : 3306 //server where this app will be running, 8889 for Mac
}

module.exports = creds;