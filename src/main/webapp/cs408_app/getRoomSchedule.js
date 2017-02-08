var mysql = require("mysql");

function getRoomSchedule(room, week)
{
	var con = mysql.createConnection(
	{
		host: "mydb.itap.purdue.edu",
		user: "bhuemann",
		password: "ben143037",
		database: "bhuemann"
	});
	
	con.query("SELECT * FROM rooms WHERE room_id = ? AND start_time > ? AND end_time < end_time + 1_week_idk" [room, week],
	function(error,results,fields){
		if(error)
			throw error;

	});
}

function getRoomSchedule(room, day)
{
	var con = mysql.createConnection(
	{
		host: "mydb.itap.purdue.edu",
		user: "bhuemann",
		password: "ben143037",
		database: "bhuemann"
	});
	
	end = day + 1_day_idk;
	
	con.query("SELECT * FROM rooms WHERE room_id = ? AND start_time > ? AND end_time < ?"
	[room, week, end],
	function(error,results,fields){
		if(error)
			throw error;

	});
}