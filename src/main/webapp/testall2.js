
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
var moment = require('moment');
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
room3 = {
    "roomID":18,
    "roomName":"G136",
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
//To remain in database with 1 hr reservations at all times
var resGetUser1 = {	"email":"resTest1@purdue.edu",
			"username":"resTest1",
			"password":"resTest1"
	     	  };
//To remain in database with 6 hrs reservations at all times
var resGetUser2 = {	"email":"resTest2@purdue.edu",
			"username":"resTest2",
			"password":"resTest2"
	          };

//To remain in database with no reservations at all times
var resGetUser3 = {	"email":"resTest3@purdue.edu",
			"username":"resTest3",
			"password":"resTest3"
	      	  };

//First test date. These entries are to remain in the database
var testDate1 = [
   {"username": "test1",
    "roomID": 1,
    "date": "2018-01-01",
    "startTime":7,
    "endTime":9,
    "shareable":0
   },
   {"username": "test1",
    "roomID": 2,
    "date": "2018-01-01",
    "startTime":7,
    "endTime":9,
    "shareable":1
   },
   {"username": "test1",
    "roomID": 3,
    "date": "2018-01-01",
    "startTime":7,
    "endTime":9,
    "shareable":1
   }
];

//Second test date. Database is to remain free of any reservations on this date
var testDate2 = "2018-02-01";


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
	query.getRoomBlockedStatus(room3.roomID, con, function(err, res){

	    if(err)
		callback(null, false);
	    else
		callback(null, res.data == room2.isBlocked);
	})

    },

    

    TEST35_PASS:function(callback){
	query.setRoomBlockedStatus(room3.roomID, true, 12345678, con, function(err, res){
	    
	    if(err)
		callback(null, false);
	    else
		callback(null, res.message == 'success');
	})

    },

    TEST36_PASS:function(callback){
	query.getRoomBlockedStatus(room3.roomID, con, function(err, res){

	    if(err)
		callback(null, false);
	    else
		callback(null, res.data == true);
	})

    },

    TEST37_PASS:function(callback){
	query.setRoomBlockedStatus(room3.roomID, false, 12345678, con, function(err, res){
	    
	    if(err)
		callback(null, false);
	    else
		callback(null, res.message == 'success');
	})

    },

    
    TEST38_PASS:function(callback){
	query.setRoomBlockedStatus(9999, true, 12345678, con, function(err, res){

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
		callback(null, true);
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
    

    
    //
    //setShareableStatus
    //

    //Set sharable status of standing reservation from false to true
    TEST44_PASS:function(callback) {
    	query.setReservationShareable(148, true, con, function(err, res){
	    
	        if(err)
			callback(null, false);
		else
			callback(null, res.message == "success");
	});
    },

    //Set sharable status of standing reservation from true to false
    TEST45_PASS:function(callback) {
     	query.setReservationShareable(148, false, con, function(err, res){
		if(err)
			callback(null, false);

		else
			callback(null, res.message == "success");
	});   
    },

    //ERR - Attempt to set status of non-existent reservation
    TEST46_PASS:function(callback) {
      	query.setReservationShareable(-1, true, con, function(err, res){
		if(err)
			callback(null, true );
		else
			callback(null,false );
	});  
    },

    //
    //getUserReservations
    //

    //Get reservations from user with 1 hr of reservations
    TEST47_PASS:function(callback){
   	query.getUserReservations(resGetUser1.username, con, function(err, res){

	    if(err)
		callback(null, false)
	    else
		callback(null, res.res.length == 0);
	});

    },

    //Get reservations from user with 6hr of reservations
    TEST48_PASS:function(callback){
   	query.getUserReservations(resGetUser2.username, con, function(err, res){
	    if(err)
		callback(null, false)
	    else
		callback(null, res.res.length == 0);
	});

    },

    //Get reservations from user with no reservations
    TEST49_PASS:function(callback){
   	query.getUserReservations(resGetUser3.username, con, function(err, res){
	    if(err)
		callback(null, false)
	    else
		callback(null, res.res.length == 0);
	});

    },

    //ERR - Get reservations from non-existent user
    TEST50_PASS:function(callback){
   	query.getUserReservations("nonUser", con, function(err, res){
	    if(err)
		callback(null, false)
	    else
	    {
		callback(null, res.res.length == 0);
	    }
	});

    },
    
    //
    //UpdateAccountPassword
    //

    //Update valid user password with correct credentials and valid new password
    TEST51_PASS:function(callback){
        var tempPassword = resGetUser1.password;
	query.updateAccountPassword(resGetUser1.username, resGetUser1.password, "Password69", con, function(err, res){
	    query.updateAccountPassword(resGetUser1.username, "Password69", tempPassword, con, function(err,res){});
	    if(err)
	    {
	        //console.log(err);
		callback(null, false)
	    }
	    else
	    {
		callback(null, res.message == "success");

		//Reset password to previous value so this doesn't fail on subsequent tests
		
	    }
	});
    },
    
    //ERR - Update valid user password with correct credentials and non-conformant
    TEST52_PASS:function(callback){
	query.updateAccountPassword(resGetUser1.username, resGetUser1.password, "pswd", con, function(err, res){
	    if(err)
		callback(null, true)
	    else
		callback(null, false);
	});
    },

    //ERR - Update valid user password with correct credentials and empty new password
    TEST53_PASS:function(callback){
	query.updateAccountPassword(resGetUser1.username, resGetUser1.password, "", con, function(err, res){
	    if(err)
		callback(null, true)
	    else
		callback(null, false);
	});
    },

    //ERR - Update valid user password with incorrect credentials
    TEST54_PASS:function(callback){
	query.updateAccountPassword(resGetUser1.username, "IncorrectPassword", "Password69", con, function(err, res){
	    if(err)
		callback(null, true)
	    else
		callback(null, false);
	});
    },
     
    //ERR - Update non-existent user password
    TEST55_PASS:function(callback){
	query.updateAccountPassword("non-user", "IncorrectPassword", "Password69", con, function(err, res){
	    if(err)
		callback(null, true)
	    else
		callback(null, false);
	});
    },

    //
    //GetAllRooms
    //

    //Get all rooms for a valid date with some reservations
    TEST56_PASS:function(callback){
	query.getAllRooms(moment("2018-01-01").format("YYYY-DD-MM"), con, function(err, res){
	    if(err)
		callback(null, false);
	    else
	    {
                var succ = true;
		//Check res against what should be there
		//
		var rooms = res.rooms;
		
		var room1Reservations = rooms.filter(function(room) {
			return room.roomid == 1;
		});

		var room2Reservations = rooms.filter(function(room) {
			return room.roomid == 2;
		});

		var room3Reservations = rooms.filter(function(room) {
			return room.roomid == 3;
		});
		
		var res1 = room1Reservations[0].res;
		var res2 = room2Reservations[0].res;
		var res3 = room3Reservations[0].res;

		succ = (res1.length == 1 && res1[0].start == testDate1[0].start && res1[0].end == testDate1[0].end && res1[0].sharable == testDate1[0].sharable);
		succ = (succ && res2.length == 1 && res2[0].startTime == 7 && res2[0].endTime == 9 && res2[0].shareable == 1);
		succ = (succ && res3.length == 1 && res3[0].startTime == 7 && res3[0].endTime == 9 && res3[0].shareable == 1);
		
		callback(null, succ);
	    }
	});
    },

    //Get all rooms for a date with no reservations
    TEST57_PASS:function(callback){
	query.getAllRooms(testDate2, con, function(err, res){
	    if(err)
	        callback(null, false);
            else
	    {
	        //Check res against what should be there
                var succ = true;
		//Check res against what should be there
		//
		var rooms = res.rooms;

		for(var i = 1; i < rooms.length; i++){
			var room = rooms[i];
			if(room.res.length != 0) {
				succ = false;
			}
		}
		
		callback(null, succ);
	    }
	});
    },

    //ERR - Get all rooms given a non-date date string
    TEST58_PASS:function(callback){
	query.getAllRooms("This is a date", con, function(err, res){
	    if(err)
	        callback(null, err.message == "invalid date");
            else
	        callback(null, false);
	});
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
