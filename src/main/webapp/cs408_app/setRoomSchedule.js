var mysql = require("mysql");

function setRoomSchedule(room, day)
{
	var con = mysql.createConnection(
	{
		host: "mydb.itap.purdue.edu",
		user: "bhuemann",
		password: "ben143037",
		database: "bhuemann"
	});
	
	con.query("INSERT INTO reservations (...) VALUES (?,... "
	[... , ...])
	function(error, results, fields)
	{
		if(error)
			throw error;
	}
	
	
}