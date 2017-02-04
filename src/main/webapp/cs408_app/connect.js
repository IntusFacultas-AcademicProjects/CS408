var mysql = require("mysql");
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

con.end(function(err) {
  // The connection is terminated gracefully
  // Ensures all previously enqueued queries are still
  // before sending a COM_QUIT packet to the MySQL server.
});
