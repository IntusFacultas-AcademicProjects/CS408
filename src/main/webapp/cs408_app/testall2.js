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


//Valid reservation
var res1 = {"username": "test1",
	    "roomID": 87,
	    "date": "2010-01-01",
	    "startTime":7,
	    "endTime":9,
	    "shareable":1
	   }


//In order to connect to the database you will need node installed on your machine.
//Once Node's installed, run command 'npm install' in 'CS408/src/main/webapp/cs408_app' dir.
//Note: This database can only be accessed through Purdue's network.
var con = mysql.createConnection({
    host: "mydb.itap.purdue.edu",
    user: "bhuemann",
    password: "ben408",
    database: "bhuemann"
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
    TEST1:function(callback){
	query.addAccount(account1.email, account1.username, account1.password, con, function(err, res){

	    if(err)
		callback(null, false)
	    else
		callback(null, res.message == 'success');
	})

    },

    //TEST PASS
    TEST2:function(callback){
	query.addAccount(account2.email, account2.username, account2.password, con, function(err, res){
	    
	    if(err)
		callback(null, false)
	    else
		callback(null, res.message == 'success');
	})

    },
    
    
    //TEST 3 ERR - duplicate email
    TEST3:function(callback){

	query.addAccount(account1.email, account2.username, account1.password, con, function(err, res){
	    console.log(err);
	    console.log(res);
	    callback(null, err.message == 'email already exists');
	})

    },

    //TEST 5 ERR - duplicate username
    TEST4:function(callback){

	query.addAccount(account2.email, account1.username, account2.password, con, function(err, res){

	    if(err)
		callback(null, false)
	    else
		callback(null, res.message == 'success');


	})

    },

    //TEST PASS
    TEST5:function(callback){

	query.deleteAccount(account2.email, con, function(err, res){
	    if(err)
		callback(null,false);
	    else
		callback(null, err.message == 'account doesnt exist');
	})

    },

    //TEST FAIL - ACCOUNT DOESNT EXIST
    TEST6:function(callback){
	
	query.deleteAccount(account2.email, con, function(err, res){
	    if(err)
		callback(null,err.message == 'account doesnt exist');
	    else
		callback(null, false);
	})

    },





    //TEST 8 TRUE - username exists
    TEST7:function(callback){

	query.usernameExists(account1.username, con, function(res){
	    callback(null, res);
	})

    },

    //TEST 9 FALSE - username does not exist
    TEST8:function(callback){

	query.usernameExists("BADUSER", con, function(res) {
	    callback(null, res);
	})

    },




    //TEST 11 TRUE - email exists
    TEST9:function(callback){

	query.emailExists(account1.email, con, function(err, res){
	    callback(null, res);
	})
    },

    //TEST 13 FALSE - email does not exist
    TEST10:function(callback){

	query.emailExists("BADEMAIL", con, function(err,res){
	    callback(null, res);
	})
    },






    //TEST 15 TRUE - valid credentials
    TEST11:function(callback){		

	query.authAccount(account1.email, account1.password, con, function(err, res){
	    callback(null, res);
	})
    }, 

    //TEST 17 FALSE - invalid credentials
    TEST12:function(callback){

	query.authAccount(account1.email, account1.password, con, function(err,res){
	    callback(null, res == "invalid credentials");
	})
    },
    
    
    //TEST 19 PASS - reservation added
    TEST13:function(callback){

	query.addReservation(res1.roomID, res1.username, res1.date, 7, 9, res1.shareable, con, function(err, res){
	    callback(null, res != null);
	})
    },

    //TEST PASS
    TEST14:function(callback){	    

	query.addReservation(res1.roomID, res1.username, res1.date, 6, 7, res1.shareable, con, function(err, res){
	    callback(null, res != null);
	})
    },

    //TEST PASS
    TEST15:function(callback){	

	query.addReservation(res1.roomID, res1.username, res1.date, 9, 10, res1.shareable, con, function(err, res){
	    callback(null, res != null);
	})
    },
    
    //ERR - overlapping reservation
    TEST16:function(callback){	

	query.addReservation(res1.roomID, res1.username, res1.date, 9, 10, res1.shareable, con, function(err, res){
	    //callback(null, err.message == 'overlapping reservation');
	    callback(null, false);
	})
    },

    //ERR - overlapping reservation
    TEST17:function(callback){	

	query.addReservation(res1.roomID, res1.username, res1.date, 10, 11, res1.shareable, con, function(err, res){
	    //callback(null, err.message == 'overlapping reservation');
	    callback(null, false);
	})
    },

    
    


    //ERR - startTime out of acceptable range [0,23]    
    TEST18:function(callback){

	query.addReservation(res1.roomID, res1.username, res1.date, 24, res1.endTime, res1.shareable, con, function(err, res){
    	    callback(null, err.message == 'startTime out of acceptable range [0,23]');
	})
    },

    //ERR - startTime out of acceptable range [0,23]
    TEST19:function(callback){	

	query.addReservation(res1.roomID, res1.username, res1.date, -1, res1.endTime, res1.shareable, con, function(err, res){
    	    callback(null,err.message == 'startTime out of acceptable range [0,23]');
	})
    },
    
    //ERR - endTime out of acceptable range [0,23]
    TEST20:function(callback){	

	query.addReservation(res1.roomID, res1.username, res1.date, res1.startTime, 24, res1.shareable, con, function(err, res){
    	    callback(null,err.message == 'endTime out of acceptable range [0,23]');
	})
    },

    //ERR - endTime out of acceptable range [0,23]
    TEST21:function(callback){	

	query.addReservation(res1.roomID, res1.username, res1.date, res1.startTime, -1, res1.shareable, con, function(err, res){
    	    callback(null, err.message == 'endTime out of acceptable range [0,23]');
	})
    },

    //TEST 15 FAIL - startTime must be less than endTime
    TEST22:function(callback){	

	query.addReservation(res1.roomID, res1.username, res1.date, 9, 8, res1.shareable, con, function(err, res){
    	    callback(null, err.message == 'startTime must be less than endTime');
	})
    },

    //TEST 15 FAIL - startTime must be less than endTime
    TEST23:function(callback){	

	query.addReservation(res1.roomID, res1.username, res1.date, 8, 8, res1.shareable, con, function(err, res){
    	    callback(null, err.message == 'startTime must be less than endTime');
	})
    },

    //ERR - invalid date
    TEST24:function(callback){

	query.addReservation(res1.roomID, res1.username, "BADDATE", res1.startTime, res1.endTime, res1.shareable, con, function(err, res){
    	    callback(null, err.message == 'invalid date');
	})
    },
    
    //ERR - invalid date
    TEST25:function(callback){	

	query.addReservation(res1.roomID, res1.username, "10-00-10", res1.startTime, res1.endTime, res1.shareable, con, function(err, res){
    	    callback(null, err.message == 'invalid date');
	})
    },

    //ERR - invalid date
    TEST26:function(callback){	

	query.addReservation(res1.roomID, res1.username, "10-13-10", res1.startTime, res1.endTime, res1.shareable, con, function(err, res){
    	    callback(null, err.message == 'invalid date');
	})
    },

    
    //TEST PASS
    TEST27:function(callback){
	
	query.deleteAccount(account1.email, con, function(err, res){
	    if(err)
		callback(null,false);
	    else
		callback(null, err.message == 'account doesnt exist');
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
