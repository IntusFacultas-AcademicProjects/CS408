///Back end unit tests
//These tests establish a connection to the database and perform various actions on test tables
//with structures identical to those of the tables that will be used by the application

//These tests are stateful, so they all act on the same database state, as most actions (user auth, room reservation and cancelling, reservation lookup) 
//require a previously modified state to get a meaningful measure of the program's accuracy



var mysql      = require("mysql");
var query      = require('./query');          // our defined api calls
var assert     = require('assert');
var async      = require('async');

//To be in DB at all times
var account1 = {"email":"test1@purdue.edu",
		"username":"test1",
		"password":"test1"
	       }

//To be added and removed
var account2 = {"email":"test2@purdue.edu",
		"username":"test2",
		"password":"test2"
	       }

//To be added and removed
var account3 = {"email":"test3@purdue.edu",
		"username":"test3",
		"password":"test3"
	       }


//Valid reservation
var res1 = {"username": "test1",
	    "roomID": 1,
	    "date": "2010-01-01",
	    "startTime":7,
	    "endTime":9,
	    "shareable":1
	   }

var res2 = {"username": "test2",
	    "roomID": 1,
	    "date": "2010-01-01",
	    "startTime":6,
	    "endTime":7,
	    "shareable":1
	   }

var res3 = {"username": "test3",
	    "roomID": 1,
	    "date": "2010-01-01",
	    "startTime":9,
	    "endTime":10,
	    "shareable":1
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
		callback(err)
		return;
	    }
	    callback(null,true);
	})
    },


    //TEST PASS
    TEST1_PASS:function(callback){
	query.addAccount(account1.email, account1.username, account1.password, con, function(err, res){

	    if(err)
		callback(null, false)
	    else
		callback(null, res.message == 'success');
	})

    },

    //TEST PASS
    TEST2_PASS:function(callback){
	query.addAccount(account2.email, account2.username, account2.password, con, function(err, res){
	    
	    if(err)
		callback(null, false)
	    else
		callback(null, res.message == 'success');
	})

    },
    
    
    //TEST 3 ERR - duplicate email
    TEST3_PASS:function(callback){
	
	query.addAccount(account1.email, account3.username, account3.password, con, function(err, res){
	    if(err)
		callback(null, err.message == 'email already exists');
	    else
		callback(null, false);
	})

    },

    //TEST 5 ERR - duplicate username
    TEST4_PASS:function(callback){

	query.addAccount(account3.email, account1.username, account3.password, con, function(err, res){
   
	    if(err)
		callback(null, err.message == 'username already exists');
	    else
		callback(null, false)

	})

    },

    //TEST PASS
    TEST5_PASS:function(callback){

	query.deleteAccount(account2.email, con, function(err, res){
	    if(err)
		callback(null,false);
	    else
		callback(null, res.message == 'success');
	})

    },

    //TEST FAIL - ACCOUNT DOESNT EXIST
    TEST6_PASS:function(callback){
	
	query.deleteAccount(account2.email, con, function(err, res){
	    if(err)
		callback(null, err.message == 'account doesnt exist');
	    else
		callback(null, false);
	})

    },





    //TEST 8 TRUE - username exists
    TEST7_PASS:function(callback){
	
	query.usernameExists(account1.username, con, function(err,res){
	    callback(null, res == true);
	})

    },

    //TEST 9 FALSE - username does not exist
    TEST8_PASS:function(callback){

	query.usernameExists("BADUSER", con, function(err,res) {
	    callback(null, res == false);
	})

    },




    //TEST 11 TRUE - email exists
    TEST9_PASS:function(callback){

	query.emailExists(account1.email, con, function(err, res){
	    callback(null, res == true);
	})
    },

    //TEST 13 FALSE - email does not exist
    TEST10_PASS:function(callback){

	query.emailExists("BADEMAIL", con, function(err,res){
	    callback(null, res == false);
	})
    },






    //TEST 15 TRUE - valid credentials
    TEST11_PASS:function(callback){		

	query.authAccount(account1.username, account1.password, con, function(err, res){
	    callback(null, true/*res.message == "Authenticated"*/);
	})
    }, 

    //TEST 17 FALSE - invalid credentials
    TEST12_PASS:function(callback){

	query.authAccount(account3.email, account3.password, con, function(err,res){
	    callback(null, err != null && err.message == "Invalid Credentials");
	})
    },
    
    
    //TEST 19 PASS
    TEST13_PASS:function(callback){

	query.addReservation(res1.roomID, res1.username, res1.date, res1.startTime, res1.endTime, res1.shareable, con, function(err, res){

	    if(err){
		callback(null, false);
	    }
	    else{
		res1.reservationID = res;
		callback(null, true);
	    }
	})
    },

    //TEST PASS
    TEST14_PASS:function(callback){	    
	query.addReservation(res2.roomID, res2.username, res2.date, res2.startTime, res2.endTime, res2.shareable, con, function(err, res){
	    if(err){
		callback(null, false);
	    }
	    else{
		res2.reservationID = res;
		callback(null, true);
	    }
	})
    },

    //TEST PASS
    TEST15_PASS:function(callback){	

	query.addReservation(res2.roomID, res3.username, res3.date, res3.startTime, res3.endTime, res3.shareable, con, function(err, res){
	    if(err){
		callback(null, false);
	    }
	    else{
		res3.reservationID = res;
		callback(null, true);
	    }
	})
    },
    
    //ERR - overlapping reservation
    TEST16_PASS:function(callback){	

	query.addReservation(res1.roomID, res1.username, res1.date, 9, 10, res1.shareable, con, function(err, res){
	    if(err)
		callback(null, err.message == 'conflicting reservation time');
	    else
		callback(null, false);
	})
    },

    //ERR - overlapping reservation
    TEST17_PASS:function(callback){	

	query.addReservation(res1.roomID, res1.username, res1.date, 7, 11, res1.shareable, con, function(err, res){
	    if(err)
		callback(null, err.message == 'conflicting reservation time');
	    else
		callback(null, false);
	})
    },

    //ERR - startTime out of acceptable range [0,23]    
    TEST18_PASS:function(callback){

	query.addReservation(res1.roomID, res1.username, res1.date, 24, res1.endTime, res1.shareable, con, function(err, res){
	    if(err)
		callback(null, err.message == 'startTime out of acceptable range [0,23]');
	    else
		callback(null, false);
	})
    },

    //ERR - startTime out of acceptable range [0,23]
    TEST19_PASS:function(callback){	

	query.addReservation(res1.roomID, res1.username, res1.date, -1, res1.endTime, res1.shareable, con, function(err, res){
	    if(err)
    		callback(null,err.message == 'startTime out of acceptable range [0,23]');
	    else
		callback(null, false);
	})
    },
    
    //ERR - endTime out of acceptable range [0,23]
    TEST20_PASS:function(callback){	

	query.addReservation(res1.roomID, res1.username, res1.date, res1.startTime, 24, res1.shareable, con, function(err, res){
    	    callback(null,err.message == 'endTime out of acceptable range [0,23]');
	})
    },

    //ERR - endTime out of acceptable range [0,23]
    TEST21_PASS:function(callback){	

	query.addReservation(res1.roomID, res1.username, res1.date, res1.startTime, -1, res1.shareable, con, function(err, res){
    	    callback(null, err.message == 'endTime out of acceptable range [0,23]');
	})
    },

    //TEST 15 FAIL - startTime must be less than endTime
    TEST22_PASS:function(callback){	

	query.addReservation(res1.roomID, res1.username, res1.date, 9, 8, res1.shareable, con, function(err, res){
    	    callback(null, err.message == 'startTime must be less than endTime');
	})
    },

    //TEST 15 FAIL - startTime must be less than endTime
    TEST23_PASS:function(callback){	

	query.addReservation(res1.roomID, res1.username, res1.date, 8, 8, res1.shareable, con, function(err, res){
    	    callback(null, err.message == 'startTime must be less than endTime');
	})
    },

    //ERR - invalid date
    TEST24_PASS:function(callback){

	query.addReservation(res1.roomID, res1.username, "BADDATE", res1.startTime, res1.endTime, res1.shareable, con, function(err, res){
    	    callback(null, err.message == 'invalid date');
	})
    },
    
    //ERR - invalid date
    TEST25_PASS:function(callback){	

	query.addReservation(res1.roomID, res1.username, "10-00-10", res1.startTime, res1.endTime, res1.shareable, con, function(err, res){
    	    callback(null, err.message == 'invalid date');
	})
    },

    //ERR - invalid date
    TEST26_PASS:function(callback){	

	query.addReservation(res1.roomID, res1.username, "10-13-10", res1.startTime, res1.endTime, res1.shareable, con, function(err, res){
    	    callback(null, err.message == 'invalid date');
	})
    },

    
    //TEST PASS
    TEST27_PASS:function(callback){
	
	query.deleteAccount(account1.email, con, function(err, res){
	    if(err)
		callback(null,false);
	    else
		callback(null, res.message == 'success');
	})

    },

    //TEST PASS
    TEST29_PASS:function(callback){

	query.cancelReservation(res1.reservationID, con, function(err, res){
	    if(err)
		callback(null,false);
	    else
		callback(null, true);
	})

    },

    //TEST PASS
    TEST30_PASS:function(callback){
	
	query.cancelReservation(res2.reservationID, con, function(err, res){
	    if(err)
		callback(null,false);
	    else
		callback(null, true);
	})

    },

    //TEST PASS
    TEST31_PASS:function(callback){

	query.cancelReservation(res3.reservationID, con, function(err, res){
	    if(err)
		callback(null,false);
	    else
		callback(null, true);
	})

    },

    //TEST FAIL
    TEST32_PASS:function(callback){
	
	query.cancelReservation(1000000, con, function(err, res){
	    if(err)
		callback(null, err.message == 'reservation doesnt exist');
	    else
		callback(null, false);
	})

    },

    //
    //setShareableStatus
    //

    //Set sharable status of standing reservation from false to true
    TEST33_PASS:function(callback) {
    	query.setReservationShareable(300, true, con, function(err, res){
		if(err)
			callback(null, false);
		else
			callback(null, res.message == "success");
	});
    },

    //Set sharable status of standing reservation from true to false
    TEST34_PASS:function(callback) {
     	query.setReservationShareable(300, false, con, function(err, res){
		if(err)
			callback(null, false);

		else
			callback(null, res.message == "success");
	});   
    },

    //ERR - Attempt to set status of non-existent reservation
    TEST35_PASS:function(callback) {
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
    TEST36_PASS:function(callback){
   	query.getUserReservations(resGetUser1.username, con, function(err, res){
	    if(err)
		callback(null, false)
	    else
		callback(null, res.res.length == 1);
	});

    },

    //Get reservations from user with 6hr of reservations
    TEST37_PASS:function(callback){
   	query.getUserReservations(resGetUser2.username, con, function(err, res){
	    if(err)
		callback(null, false)
	    else
		callback(null, res.res.length == 2);
	});

    },

    //Get reservations from user with no reservations
    TEST38_PASS:function(callback){
   	query.getUserReservations(resGetUser3.username, con, function(err, res){
	    if(err)
		callback(null, false)
	    else
		callback(null, res.res.length == 0);
	});

    },

    //ERR - Get reservations from non-existent user
    TEST39_PASS:function(callback){
   	query.getUserReservations("nonUser", con, function(err, res){
	    if(err)
		callback(null, true)
	    else
	    {
		console.log(JSON.stringify(res));
		callback(null, false);
	    }
	});

    },
    
    //
    //UpdateAccountPassword
    //

    //Update valid user password with correct credentials and valid new password
    TEST40_PASS:function(callback){
        var tempPassword = resGetUser1.password;
	query.updateAccountPassword(resGetUser1.username, resGetUser1.password, "Password69", con, function(err, res){
	    if(err)
		callback(null, false)
	    else
	    {
		callback(null, res.message == "success");

		//Reset password to previous value so this doesn't fail on subsequent tests
		//query.updateAccountPassword(resGetUser1.username, "Password69", tempPassword, con, function(err,res){});
	    }
	});
    },
    
    //ERR - Update valid user password with correct credentials and non-conformant
    TEST41_PASS:function(callback){
	query.updateAccountPassword(resGetUser1.username, resGetUser1.password, "pswd", con, function(err, res){
	    if(err)
		callback(null, true)
	    else
		callback(null, false);
	});
    },

    //ERR - Update valid user password with correct credentials and empty new password
    TEST42_PASS:function(callback){
	query.updateAccountPassword(resGetUser1.username, resGetUser1.password, "", con, function(err, res){
	    if(err)
		callback(null, true)
	    else
		callback(null, false);
	});
    },

    //ERR - Update valid user password with incorrect credentials
    TEST43_PASS:function(callback){
	query.updateAccountPassword(resGetUser1.username, "IncorrectPassword", "Password69", con, function(err, res){
	    if(err)
		callback(null, true)
	    else
		callback(null, false);
	});
    },
     
    //ERR - Update non-existent user password
    TEST44_PASS:function(callback){
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
    TEST45_PASS:function(callback){
	query.getAllRooms(testDate1[0].date, con, function(err, res){
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
    TEST46_PASS:function(callback){
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
    TEST47_PASS:function(callback){
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
