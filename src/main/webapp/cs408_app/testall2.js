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
	    "startTime":8,
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

async.waterfall([

    con.connect(function(err){
	if(err){
	    console.log('Error connecting to Db');
	    return;
	}
	console.log('Connection established');
    }),





    /////////////////////
    ///Add Account
    /////////////////////

    //TEST 1 TRUE
    query.addAccount(account1.email, account1.username, account1.password, con, function(err, res)
		     {
			 assert.ok(!err);
		     }),

    // //TEST 3 ERR - duplicate email
    // query.addAccount(account1.email, account1.username, account1.password, con, function(err, res)
    // 		     {
    // 			 assert.ok(err);
    // 			 assert.equal(err.message, 'Email already exists');
    // 		     }),

    // //TEST 5 ERR - duplicate username
    // query.addAccount(account2.email, account1.username, account1.password, con, function(err, res)
    // 		     {
    // 			 assert.ok(err);
    // 			 assert.equal(err.message, 'Username already exists');
    // 		     }),






    // /////////////////////
    // ///Username Exists
    // /////////////////////

    // //TEST 8 TRUE - username exists
    // query.usernameExists(account1.username, con, function(res)
    // 			 {
    // 			     assert.ok(res);
    // 			 }),

    // //TEST 9 FALSE - username does not exist
    // query.usernameExists("BADUSER", con, function(res)
    // 			 {
    // 			     assert.ok(!res);
    // 			 }),





    // /////////////////////
    // ///Email Exists
    // /////////////////////

    // //TEST 11 TRUE - email exists
    // query.emailExists(account1.email, con, function(err, res)
    // 		      {
    // 			  assert.ok(!err);
    // 			  assert.ok(res);
    // 		      }),


    // //TEST 13 FALSE - email does not exist
    // query.emailExists("BADEMAIL", con, function(err,res)
    // 		      {
    // 			  assert.ok(!err);
    // 			  assert.ok(!res);
    // 		      }),







    // /////////////////////
    // ///Authenticate Acct
    // /////////////////////

    // //TEST 15 TRUE - valid credentials
    // query.authAccount(account1.email, account1.password, con, function(err, res)
    // 		      {
    // 			  assert.ok(!err);
    // 			  assert.ok(res);
    // 		      }), 


    // //TEST 17 FALSE - invalid credentials
    // query.authAccount(account1.email, account1.password, con, function(err,res)
    // 		      {
    // 			  assert.ok(!err);
    // 			  //assert.equal(res, "wrong email or password");
    // 		      }),
    
    
    
    
    
    
    // /////////////////////
    // ///Add reservation
    // /////////////////////
    
    // //TEST 19 PASS - reservation added
    // query.addReservation(res1.roomID, res1.username, res1.date, res1.starTime, res1.endTime, res1.shareable, con, function(err, res)
    // 			 {
    // 			     assert.ok(!err);
    // 			 }),

    // //ERR - username doesnt exist
    // //TODO NEEDS IMPLEMENTING
    // /*
    //   query.addReservation(res1.roomID, "BADUSER", res1.date, res1.starTime, res1.endTime, res1.shareable, con, function(err, res)
    //   {
    //   assert.ok(!err);
    //   assert.ok(err.message, 'room is already reserved for this time slot');
    //   });
    // */

    // //ERR - startTime out of acceptable range [0,23]
    // query.addReservation(res1.roomID, res1.username, res1.date, 24, res1.endTime, res1.shareable, con, function(err, res)
    // 			 {
    // 			     assert.ok(err);
    // 			     assert.equal(err.message, 'startTime out of acceptable range [0,23]');
    // 			 }),

    // //ERR - startTime out of acceptable range [0,23]
    // query.addReservation(res1.roomID, res1.username, res1.date, -1, res1.endTime, res1.shareable, con, function(err, res)
    // 			 {
    // 			     assert.ok(err);
    // 			     assert.equal(err.message, 'startTime out of acceptable range [0,23]');
    // 			 }),

    // //ERR - endTime out of acceptable range [0,23]
    // query.addReservation(res1.roomID, res1.username, res1.date, res1.startTime, 24, res1.shareable, con, function(err, res)
    // 			 {
    // 			     assert.ok(err);
    // 			     assert.equal(err.message, 'endTime out of acceptable range [0,23]');
    // 			 }),

    // //ERR - endTime out of acceptable range [0,23]
    // query.addReservation(res1.roomID, res1.username, res1.date, res1.startTime, -1, res1.shareable, con, function(err, res)
    // 			 {
    // 			     assert.ok(err);
    // 			     assert.equal(err.message, 'endTime out of acceptable range [0,23]');
    // 			 }),

    // //TEST 15 FAIL - startTime must be less than endTime
    // query.addReservation(res1.roomID, res1.username, res1.date, 9, 8, res1.shareable, con, function(err, res)
    // 			 {
    // 			     assert.ok(err);
    // 			     assert.equal(err.message, 'startTime must be less than endTime');
    // 			 }),

    // //TEST 15 FAIL - startTime must be less than endTime
    // query.addReservation(res1.roomID, res1.username, res1.date, 8, 8, res1.shareable, con, function(err, res)
    // 			 {
    // 			     assert.ok(err);
    // 			     assert.equal(err.message, 'startTime must be less than endTime');
    // 			 }),


    // //ERR - invalid date
    // query.addReservation(res1.roomID, res1.username, "BADDATE", res1.startTime, res1.endTime, res1.shareable, con, function(err, res)
    // 			 {
    // 			     assert.ok(err);
    // 			     assert.equal(err.message, 'invalid date');
    // 			 }),

    // //ERR - invalid date
    // query.addReservation(res1.roomID, res1.username, "10-00-10", res1.startTime, res1.endTime, res1.shareable, con, function(err, res)
    // 			 {
    // 			     assert.ok(err);
    // 			     assert.equal(err.message, 'invalid date');
    // 			 }),

    // //ERR - invalid date
    // query.addReservation(res1.roomID, res1.username, "10-13-10", res1.startTime, res1.endTime, res1.shareable, con, function(err, res)
    // 			 {
    // 			     assert.ok(err);
    // 			     assert.equal(err.message, 'invalid date');
    // 			 }),


    //ERR - make overlapping reservation
    //TODO NEEDS IMPLEMENTING
    /*
      query.addReservation(
      {
      assert.ok(!err);
      assert.equal(err.message, 'room is already reserved for this time slot');
      });
    */

    con.end(function(err) {
	// The connection is terminated gracefully
	// Ensures all previously enqueued queries are still
	// before sending a COM_QUIT packet to the MySQL server.
	process.exit();
    })
    
], function (err, result) {
    // result now equals 'done'
    console.log(result);
});
