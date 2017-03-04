
/*
BACKEND SPRINT 2 UNIT TESTS

These tests establish a connection to the database and perform various actions on test tables
with structures identical to those of the tables that will be used by the application

These tests are stateful, so they all act on the same database state, as most actions (user auth, room reservation and cancelling, reservation lookup) 
require a previously modified state to get a meaningful measure of the program's accuracy


These tests provide coverage for the following API calls:

    updateAccountPassword();
    getUserReservations();
    setReservationShareable();
    getAllRooms();
    
    getRoomBlockedStatus();
    setRoomBlockedStatus();
    getRoomSchedule();
    getUserHours();

*/

//Thses data will be in database at all times
//Any API calls that change the working order
//of the DB make sure to undo before closing

user1 = {

    "email":"dummy1@purdue.edu",
    "username":"dummy1",
    "hoursRemain":5
    
}

user2 = {

    "email":"dummy2@purdue.edu",
    "username":"dummy2",
    "hoursRemain":1
    
}


room1 = {
    "roomID":0,
    "roomName":"G118",
    "isBlocked":true
}

room2 = {
    "roomID":1,
    "roomName":"G119",
    "isBlocked":false
}

roomSchedule1 = {
  "roomID": 1,
  "roomName": "G119",
  "date": "2000-01-01",
  "blocked": false,
  "reservations": [
    {
      "reservation_id": 60,
      "username": "dummy1",
      "startTime": 4,
      "endTime": 5,
      "shareable": 0
    },
    {
      "reservation_id": 61,
      "username": "dummy3",
      "startTime": 6,
      "endTime": 7,
      "shareable": 0
    }
  ]
}

var mysql      = require("mysql");
var query      = require('./query');          // our defined api calls
var assert     = require('assert');
var async      = require('async');

//In order to connect to the database you will need node installed on your machine.
//Once Node's installed, run command 'npm install' in 'CS408/src/main/webapp/cs408_app' dir.
//Note: This database can only be accessed through Purdue's network.
var con = mysql.createConnection({
    host: "mydb.itap.purdue.edu",
    user: "pike4",
    password: "mike408",
    database: "pike4"
});

async.series({

    CON_CONNECT:function(callback){
	con.connect(function(err){
	    if(err){
		callback(err);
		return;
	    }
	    callback(null,true);
	})
    },



    TEST33_PASS:function(callback){
	query.getRoomBlockedStatus(room1.roomID, con, function(err, res){

	    if(err)
		callback(null, false);
	    else
		callback(null, res.data == room1.isBlocked);
	})

    },

    TEST34_PASS:function(callback){
	query.getRoomBlockedStatus(room2.roomID, con, function(err, res){

	    if(err)
		callback(null, false);
	    else
		callback(null, res.data == room2.isBlocked);
	})

    },

    

    TEST35_PASS:function(callback){
	query.setRoomBlockedStatus(room2.roomID, true, con, function(err, res){
	    
	    if(err)
		callback(null, false);
	    else
		callback(null, res.message == 'success');
	})

    },

    TEST36_PASS:function(callback){
	query.getRoomBlockedStatus(room2.roomID, con, function(err, res){

	    if(err)
		callback(null, false);
	    else
		callback(null, res.data == true);
	})

    },

    TEST37_PASS:function(callback){
	query.setRoomBlockedStatus(room2.roomID, false, con, function(err, res){
	    
	    if(err)
		callback(null, false);
	    else
		callback(null, res.message == 'success');
	})

    },

    
    TEST38_PASS:function(callback){
	query.setRoomBlockedStatus(9999, true, con, function(err, res){
	    
	    if(err)
		callback(null, false);
	    else
		callback(null, res.err == "roomID doesn't exist");
	})
	
    },
    
    TEST39_PASS:function(callback){
	query.getRoomSchedule(1, "2000-01-01", con, function(err, res){

	    if(err)
		callback(null, false);
	    else
		callback(null, JSON.stringify(res) == JSON.stringify(roomSchedule1));
	})
	
    },

    TEST40_PASS:function(callback){
	query.getRoomSchedule(9999, "2000-01-01", con, function(err, res){

	    //console.log(JSON.stringify(res));

	    if(err)
		callback(null, false);
	    else
		callback(null, res.err == "room does not exist");
	})
	
    },
    
    TEST41_PASS:function(callback){
	query.getUserHours(user1.username, con, function(err, res){

	    if(err){
	    	callback(null, false);
	
	    }
	    else{
	    	callback(null, res.data == 5);
	    }
	})
	
    },


    TEST42_PASS:function(callback){
	query.getUserHours(user2.username, con, function(err, res){

	    if(err)
		callback(null, false)
	    else
		callback(null, res.data == 1);
	})
	
    },

    TEST43_PASS:function(callback){
	query.getUserHours("BADUSER", con, function(err, res){

	    if(err)
		callback(null, false)
	    else
		callback(null, res.err == "username doesn't exist");
	})
	
    },
    

    
    

    CON_QUIT:function(callback){
	con.end(function(err) {
	    // The connection is terminated gracefully
	    // Ensures all previously enqueued queries are still
	    // before sending a COM_QUIT packet to the MySQL server.
	    callback(null, true);
	})
    }
    
}, function (err, result) {
    // result now equals 'done'
    console.log(result);
});
