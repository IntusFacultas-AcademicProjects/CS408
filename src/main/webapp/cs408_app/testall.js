// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mysql      = require("mysql");
var query      = require('./query');          // our defined api calls
var assert     = require('assert');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8888;        // set our port

//In order to connect to the database you will need node installed on your machine.
//Once Node's installed, run command 'npm install' in 'CS408/src/main/webapp/cs408_app' dir.
//Note: This database can only be accessed through Purdue's network.
var con = mysql.createConnection({
  host: "mydb.itap.purdue.edu",
  user: "bhuemann",
  password: "ben408",
  database: "bhuemann"
});

console.log('Creating connection to mySQL server');

con.connect(function(err){
    if(err){
	console.log('Error connecting to Db');
	return;
    }
    console.log('Connection established');
});

var email_1 = "foo1@purdue.edu";
var username_1 = "foo1";
var pass_1 = "password1";

var email_2 = "foo2@purdue.edu";
var username_2 = "foo2";
var pass_2 = " ";


var email_3 = "ayy";
var username_3 = "foo3";
var pass_3 = "lmao";

//TODO - kill database

//TEST 1 TRUE
addAccount("test1@purdue.edu", "test1", "test1", con, function(err, res)
{
    assert.ok(!err);
});

//TEST 2 ERR - duplicate email
addAccount("test1@purdue.edu", "test2", "test2", con, function(err, res)
{
    assert.ok(err);
    assert.equals(err.message, 'Email already exists');
 
});

//TEST 3 ERR - duplicate username
addAccount("test3@purdue.edu", "test1", "test3", con, function()
{
    assert.ok(err);
    assert.equals(err.message, 'Username already exists');

});

//TEST 4 ERR - bad connection
addAccount("ayy", "foo3", "password1", null, function()
{
    assert.ok(!err);
    
});

//TEST 5 TRUE - username exists
usernameExists('test1', con, function(res)
{
    assert.ok(res);
});

//TEST 6 FALSE - username does not exist
usernameExists('test10', con, function(res)
{
    assert.ok(!res);
});

//TEST 7 TRUE - email exists
emailExists('test1@purdue.edu', con, function(err, res)
{
    assert.ok(!err);
    assert.ok(res);
});

//TEST 8 FALSE - email does not exist
emailExists('IUSucks@purdue.edu', con, function(err,res)
{
    assert.ok(!err);
    assert.ok(!res);
});


//TEST 9 TRUE - valid credentials
authAccount('test1@purdue.edu', 'test1', con, function(err, res)
{
    assert.ok(!err);
    assert.ok(res);
}); 

//TEST 10 FALSE - invalid credentials
authAccount('pete@purdue.edu', 'boilerUP', con, function(err,res)
{
    assert.ok(!err);
    assert.ok(!res);
});

//TEST 11 PASS - reservation added
addReservation(12, "test1", "02-10-17", 8, 10, true, con, function(err, res)
{
    assert.ok(!err);
});


//TEST 12 FAIL - reservation slot taken
//NEEDS IMPLEMENTING!
addReservation("G101", "foo1", "02/10/2017", 9, 10, "true", con, function()
{
	//TODO
});

//TEST 13 FAIL - startTime out of acceptable range [0,23]
addReservation(12, "test1", "2002-10-17", -1, 10, true, con, function(err, res)
{
    assert.ok(err);
    assert.equals(err.message, 'startTime out of acceptable range [0,23]');
});

//TEST 14 FAIL - endTime out of acceptable range [0,23]
addReservation(12, "test1", "2002-10-17", 8, 24, true, con, function(err, res)
{
    assert.ok(err);
    assert.equals(err.message, 'endTime out of acceptable range [0,23]');
});

//TEST 15 FAIL - startTime must be less than endTime
addReservation(12, "test1", "2002-10-17", 8, 8, true, con, function(err, res)
{
    assert.ok(err);
    assert.equals(err.message, 'startTime must be less than endTime');
});

//TEST 16 FAIL - startTime must be less than endTime
addReservation(12, "test1", "2002-10-17", 12, 10, true, con, function(err, res)
{
    assert.ok(err);
    assert.equals(err.message, 'startTime must be less than endTime');
});

//TEST 17 FAIL - invalid date
addReservation(12, "test1", "2002-13-17", 8, 10, true, con, function(err, res)
{
    assert.ok(err);
    assert.equals(err.message, 'invalid date');
});

//TEST 18 FAIL - invalid date
addReservation(12, "test1", "ayy LMAO", 8, 10, true, con, function(err, res)
{
    assert.ok(err);
    assert.equals(err.message, 'invalid date');
});

//TEST 19 FAIL - invalid username
//NEEDS IMPLEMENTING
addReservation(12, "LAWL", "2002-10-17", 8, 10, true, con, function(err, res)
{
    assert.ok(err);
    assert.equals(err.message, 'TODO');
});








//Attempt to make 7th hour of reservations
addReservation("G101", "foo1", "02/10/2017", 15, 16, "true", con, function()
{
	
}); //Assert failure, too many reservations


getRoomSchedule("G101", "02/10/2017", con, function()
{
	
}); //Assert 2 reservations returned

getRoomSchedule("G101", "02/11/2017", con, function()
{
	
}); //Assert 0 reservations returned

getAllRooms("02/10/2017", con, function()
{
	
}); //Assert 2 reservations returned

getAllRooms("02/10/2017", con, function()
{
	
}); //Assert 0 reervations returned

//Cancel the first reservation
cancelReservation(rsvp_ID_1, con, function()
{
	
}); //Assert success

//Cancel the second reservation
cancelReservation(rsvp_ID_1, con, function()
{
	
}); //Assert success

//Attempt to cancel a nonexistent reservation
cancelReservation(rsvp_ID_1, con, function()
{
	
}); //Assert failure

//Make 2 hours of valid reservations
addReservation("G101", "foo1", "02/10/2017", 8, 10, "true", con, function()
{
	
}); //Assert success

//Make 2 hours of valid reservations
addReservation("G101", "foo1", "02/10/2017", 9, 10, "true", con, function()
{
	
}); //Assert success

getRoomSchedule("G101", "02/10/2017", con, function()
{
	
}); //Assert 2 reservations returned

getRoomSchedule("G101", "02/11/2017", con, function()
{
	
}); //Assert 0 reservations returned

getAllRooms("02/10/2017", con, function()
{
	
}); //Assert 2 reservations returned

getAllRooms("02/10/2017", con, function()
{
	
}); //Assert 0 reervations returned
