var mysql = require("mysql");

function setRoomSchedule(room, day)
{
	var con = mysql.createConnection(
	{
		host: "mydb.itap.purdue.edu",
		user: "bhuemann",
		password: "ben408",
		database: "bhuemann"
	});
	
	con.query("INSERT INTO reservations (date, end_time, reservation_id, room_id, shareable, start_time, username) VALUES (?,?,?,?,?,?)"
	[day, unused, unused, newID, room, unused, unused, unused])
	function(error, results, fields)
	{
		if(error)
			throw error;
	}
	
	con.end(function(err){});
}