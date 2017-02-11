///Back end unit tests
//These tests establish a connection to the database and perform various actions on test tables
//with structures identical to those of the tables that will be used by the application

//These tests are stateful, so they all act on the same database state, as most actions (user auth, room reservation and cancelling, reservation lookup) 
//require a previously modified state to get a meaningful measure of the program's accuracy



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

query.query("DELETE FROM test_users");
query.query("DELETE FROM test_reservations");

/////////////////////
///Add Account
/////////////////////
//TEST 0 TRUE
query.addAccount("foo1@purdue.edu", "foo1", "password1", con, function()
{
	
});

//TEST 1 TRUE
addAccount("test1@purdue.edu", "test1", "test1", con, function(err, res)
{
    assert.ok(!err);
});

//TEST 2 ERR - bad password
query.addAccount("foo2@purdue.edu", "foo2", " ", con, function()
{
	
});

//TEST 3 ERR - duplicate email
addAccount("test1@purdue.edu", "test2", "test2", con, function(err, res)
{
    assert.ok(err);
    assert.equals(err.message, 'Email already exists');
});

//TEST 4 ERR - bad username
query.addAccount("ayy", "foo3", "password1", con, function()
{
	assert(!err);
});

//TEST 5 ERR - duplicate username
addAccount("test3@purdue.edu", "test1", "test3", con, function()
{
    assert.ok(err);
    assert.equals(err.message, 'Username already exists');
});

//TEST 6 ERR - bad username, bad password
query.addAccount("ayy", "foo1", "lmao", con, function()
{
	
});

//TEST 7 ERR - bad connection
addAccount("ayy", "foo3", "password1", null, function()
{
    assert.ok(!err);
});

//TEST 8 TRUE - username exists
usernameExists('test1', con, function(res)
{
    assert.ok(res);
});

//TEST 9 FALSE - username does not exist
usernameExists('test10', con, function(res)
{
    assert.ok(!res);
});

/////////////////////
///Add Username Exists
/////////////////////

//TEST 10 TRUE - username exists
query.usernameExists(username_1, con, function(err, res)
{
	assert.ok(err);
});

//TEST 11 TRUE - email exists
emailExists('test1@purdue.edu', con, function(err, res)
{
    assert.ok(!err);
    assert.ok(res);
});

//TEST 12 TRUE - username exists
query.usernameExists(username_1, con, function(err, res)
{
	assert.ok(err);
});

//TEST 13 FALSE - email does not exist
emailExists('IUSucks@purdue.edu', con, function(err,res)
{
    assert.ok(!err);
    assert.ok(!res);
});

/////////////////////
///Email Exists
/////////////////////

//TEST 14 TRUE - email exists
query.emailExists(email_1, con, function(err, res)
{
	assert.ok(err);
	assert.ok();
});

//TEST 15 TRUE - valid credentials
authAccount('test1@purdue.edu', 'test1', con, function(err, res)
{
    assert.ok(!err);
    assert.ok(res);
}); 

//TEST 16 FALSE - bad username and password
query.emailExists(email_2, con, function(err, res)
{
	assert.ok(err);
	assert.equals(res, "wrong email or password");
});

//TEST 17 FALSE - invalid credentials
authAccount('pete@purdue.edu', 'boilerUP', con, function(err,res)
{
    assert.ok(!err);
	assert.equals(res, "wrong email or password");
});

//TEST 18 TRUE - successful login
query.authAccount(email_1, pass_1, con, function(err, res)
{
	assert.ok(!err);
});

//TEST 19 PASS - reservation added
addReservation(12, "test1", "02-10-17", 8, 10, true, con, function(err, res)
{
    assert.ok(!err);
});

//TEST 20 ERR - bad password
query.authAccount(email_1, pass_2, con, function()
{
	assert.ok(!err);
	assert.ok(err.message, 'wrong email or password');
});

//TEST 21 ERR - log in to account that could not be created
query.authAccount(email_2, pass_2, con, function(err, res)
{
	assert.ok(!err);
	assert.ok(err.message, 'wrong email or password');
});

//ERR - reservation slot taken
addReservation("G101", "foo1", "02/10/2017", 9, 10, "true", con, function()
{
	assert.ok(!err);
	assert.ok(err.message, 'room is already reserved for this time slot');
});

//ERR - log in to non-existent account
query.authAccount("foo34@purdue.edu", "password1", con, function(err, res)
{
	assert.ok(!err);
	assert.equals(err.message, 'wrong email or password');
});

//ERR - startTime out of acceptable range [0,23]
addReservation(12, "test1", "2002-10-17", -1, 10, true, con, function(err, res)
{
    assert.ok(err);
    assert.equals(err.message, 'startTime out of acceptable range [0,23]');
});

//ERR - endTime out of acceptable range [0,23]
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

//Make 2 hours of valid reservations
query.addReservation("G101", "foo1", "02/10/2017", 8, 10, "true", con, function(err, res)
{
	assert.ok(err);
});

//TEST 16 FAIL - startTime must be less than endTime
addReservation(12, "test1", "2002-10-17", 12, 10, true, con, function(err, res)
{
    assert.ok(err);
    assert.equals(err.message, 'startTime must be less than endTime');
});

//ERR - make overlapping reservation
query.addReservation("G101", "foo1", "02/10/2017", 9, 10, "true", con, function(err, res)
{
	assert.ok(!err);
	assert.equals(err.message, 'room is already reserved for this time slot');
});

//ERR - invalid date
addReservation(12, "test1", "2002-13-17", 8, 10, true, con, function(err, res)
{
    assert.ok(!err);
    assert.equals(err.message, 'invalid date');
});

//ERR - invalid date
addReservation(12, "test1", "ayy LMAO", 8, 10, true, con, function(err, res)
{
    assert.ok(!err);
    assert.equals(err.message, 'invalid date');
});

//GOOD - Make 4 hours of valid reservations
query.addReservation("G101", "foo1", "02/10/2017", 10, 15, "true", con, function(err, res)
{
	assert.ok(err);
});

//ERR - invalid username
addReservation(12, "LAWL", "2002-10-17", 8, 10, true, con, function(err, res)
{
    assert.ok(!err);
    assert.equals(err.message, 'invalid username');
});

//ERR - Attempt to make 7th hour of reservations
query.addReservation("G101", "foo1", "02/10/2017", 15, 16, "true", con, function()
{
	assert.ok(!err);
	assert.equals(err.message, 'too many reservations');
});

//GOOD - Get reservation from first day for G101
query.getRoomSchedule("G101", "02/10/2017", con, function()
{
	assert.ok(err);
	assert.ok(res.length == 2);
});

//GOOD - Get reservation from second day for G101
query.getRoomSchedule("G101", "02/11/2017", con, function()
{
	assert.ok(err);
	assert.ok(res.length == 0);
});

//GOOD - Get all reservation from first day
query.getAllRooms("02/10/2017", con, function()
{
	assert.ok(err);
	assert.ok(res.length == 2);
});

//GOOD - Get reservation from first day
query.getAllRooms("02/10/2017", con, function()
{
	assert.ok(err);
	assert.ok(res.length == 0);
});

//GOOD - cancel first reservation
query.cancelReservation(rsvp_ID_1, con, function()
{
	assert.ok(err);
});

//GOOD - cancel second reservation
query.cancelReservation(rsvp_ID_2, con, function()
{
	assert.ok(err);
});

//ERR - cancel first reservation again
query.cancelReservation(rsvp_ID_1, con, function()
{
	assert.ok(!err);
});

//ERR - cancel non-existent reservation
query.cancelReservation(rsvp_ID_1, con, function()
{
	assert.ok(!err);
});

//GOOD - Make 2 hours of valid reservations
query.addReservation("G101", "foo1", "02/10/2017", 8, 10, "true", con, function()
{
	assert.ok(err);
});

//GOOD - Make 2 hours of valid reservations
query.addReservation("G101", "foo1", "02/10/2017", 9, 10, "true", con, function()
{
	assert.ok(err);
});

//GOOD - get schedule for G101 on first day
query.getRoomSchedule("G101", "02/10/2017", con, function()
{
	assert.ok(err);
	assert.ok(res.length == 2);
});

//GOOD - get schedule for G101 on second day
query.getRoomSchedule("G101", "02/11/2017", con, function(err, res)
{
	assert.ok(err);
	assert.ok(res.length == 0);
});

//GOOD - get schedule for all rooms on first day
query.getAllRooms("02/10/2017", con, function(err, res)
{
	assert.ok(err);
	assert.ok(res.length == 2);
});

//GOOD - get schedule for all rooms on first day
query.getAllRooms("02/10/2017", con, function(err, res)
{
	assert.ok(err);
	assert.ok(res.length == 0);
});
