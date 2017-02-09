var mysql = require("mysql");

function getRoomSchedule(room, week)
{
	var con = mysql.createConnection(
	{
		host: "mydb.itap.purdue.edu",
		user: "bhuemann",
		password: "ben408",
		database: "bhuemann"
	});
	
	end_date = week + 1_week_idk;
	
	con.query("SELECT * FROM rooms WHERE room_id = ? AND date > ? AND date < ?"
	[room, week, end_date],
	function(error,results,fields){
		if(error)
			throw error;

	});
	con.end(function(err){});
}

function getRoomSchedule(room, day)
{
	var con = mysql.createConnection(
	{
		host: "mydb.itap.purdue.edu",
		user: "bhuemann",
		password: "ben408",
		database: "bhuemann"
	});
	
	con.query("SELECT * FROM rooms WHERE room_id = ? AND date = ?"
	[room, day],
	function(error,results,fields){
		if(error)
			throw error;

	});
	
	con.end(function(err){});
}