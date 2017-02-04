var mysql = require("mysql");

//In order to connect to the database you will need node installed on your machine.
//Once Node's installed, run command 'npm install' in 'CS408/src/main/webapp/cs408_app' dir.
//Note: This database can only be accessed through Purdue's network.
var con = mysql.createConnection({
  host: "mydb.itap.purdue.edu",
  user: "bhuemann",
  password: "",
  database: "bhuemann"
});

con.connect(function(err){
  if(err){
    console.log(err);
    return;
  }
  console.log('Connection established');
});

con.query('SELECT * FROM users',function(err,rows){
    if(err) throw err;

    console.log('Data received from Db:\n');
    console.log(rows);
});

con.end(function(err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
});

