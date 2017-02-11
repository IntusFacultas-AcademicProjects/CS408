var mysql      = require("mysql");
var query      = require('../query');          // our defined api calls
var assert     = require('assert');
var async      = require('async');
var sleep      = require('sleep');

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
    con.connect(function(err){
	if(err){
	    console.log('Error connecting to Db');
	    return;
	}
	console.log('Connection established');
    });
    /////////////////////
    ///Add Account
    /////////////////////

    //TEST 1 TRUE
    query.addAccount(account1.email, account1.username, account1.password, con, function(err, res)
		     {
			 assert.ok(!err);
			 console.log("Passed Account Creation Test 1");
			 sleep.sleep(3);
			 // TEST 3 ERR - duplicate email
			 query.addAccount(account1.email, account1.username, account1.password, con, function(err, res)
			 		     {
			 			 assert.ok(err);
			 			 //assert.equal(err.message, 'Email already exists');
			 			 console.log("Passed Account Creation Test 2");
						 sleep.sleep(3);
						 //TEST 5 ERR - duplicate username
						 query.addAccount(account2.email, account1.username, account1.password, con, function(err, res)

						 		     {

						 			 assert.ok(err);
									 
						 			 //assert.equal(err.message, 'Username already exists');
						 			 console.log("Passed Account Creation Test 3");
									 sleep.sleep(3);
									 con.end(function(err) {
									     // The connection is terminated gracefully
									     // Ensures all previously enqueued queries are still
									     // before sending a COM_QUIT packet to the MySQL server.
									     console.log("Quitting");
									     process.exit();
									 });
			 		     			});


			 		     });
		     });

    
