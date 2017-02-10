var mysql = require("mysql");

function getAllRooms(day)
{
	var con = mysql.createConnection(
	{
		host: "mydb.itap.purdue.edu",
		user: "bhuemann",
		password: "ben408",
		database: "bhuemann"
	});
	
	con.connect(function(err){
		if(err)
		{
			console.log(err);
			return;
		}
		console.log('Connection established');
    });
	
	con.query('SELECT * FROM reservations WHERE start_time > ? AND end_time < ?' 
	[day, day], function(err,rows)
	{
		if(err) throw err;
		
	console.log('Data received from Db:\n');
	console.log(rows);
    });

    con.end(function(err) 
	{
	// The connection is terminated gracefully
	// Ensures all previously enqueued queries are still
	// before sending a COM_QUIT packet to the MySQL server.
    });
}