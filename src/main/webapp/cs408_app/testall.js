// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mysql      = require("mysql");
var query      = require('./query');          // our defined api calls

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


/////////////////////
///Add Account
/////////////////////
query.addAccount("foo1@purdue.edu", "foo1", "password1", con, function()
{
	
});//should succeed

query.addAccount("foo2@purdue.edu", "foo2", " ", con, function()
{
	
});//should fail

query.addAccount("ayy", "foo3", "password1", con, function()
{
	
});//should fail

query.addAccount("ayy", "foo1", "lmao", con, function()
{
	
});//should fail



/////////////////////
///Add Username Exists
/////////////////////
query.usernameExists(username_1, con, function()
{
	
}); //assert true

query.usernameExists(username_1, con, function()
{
	
}); //assert false


/////////////////////
///Email Exists
/////////////////////
query.emailExists(email_1, con, function()
{
	
}); //assert true

query.emailExists(email_2, con, function()
{
	
}); //assert false

/////////////////////
///Auth Account
/////////////////////

//log in to valid account with valid credentials
query.authAccount(email_1, pass_1, con, function()
{
	
}); //assert success

//log in to valid account with invalid credentials
query.authAccount(email_1, pass_2, con, function()
{
	
}); //assert failure

//log in to account that could not be created
query.authAccount(email_2, pass_2, con, function()
{
	
}); //assert failure

//log in to non-existent account
query.authAccount("foo34@purdue.edu", "password1", con, function()
{
	
}); //assert failure


/////////////////////
///Add Reservation
/////////////////////

//Make 2 hours of valid reservations
query.addReservation("G101", "foo1", "02/10/2017", 8, 10, "true", con, function()
{
	
}); //Assert success

//Make an invalid reservation overlapping with previous one
//Are we only allowing reservations starting on the hour?
query.addReservation("G101", "foo1", "02/10/2017", 9, 10, "true", con, function()
{
	
}); //Assert failure, room already reserved for specified time

//Make 4 hours of valid reservations
query.addReservation("G101", "foo1", "02/10/2017", 10, 15, "true", con, function()
{
	
}); //Assert success

//Attempt to make 7th hour of reservations
query.addReservation("G101", "foo1", "02/10/2017", 15, 16, "true", con, function()
{
	
}); //Assert failure, too many reservations


query.getRoomSchedule("G101", "02/10/2017", con, function()
{
	
}); //Assert 2 reservations returned

query.getRoomSchedule("G101", "02/11/2017", con, function()
{
	
}); //Assert 0 reservations returned

query.getAllRooms("02/10/2017", con, function()
{
	
}); //Assert 2 reservations returned

query.getAllRooms("02/10/2017", con, function()
{
	
}); //Assert 0 reervations returned

//Cancel the first reservation
query.cancelReservation(rsvp_ID_1, con, function()
{
	
}); //Assert success

//Cancel the second reservation
query.cancelReservation(rsvp_ID_1, con, function()
{
	
}); //Assert success

//Attempt to cancel a nonexistent reservation
query.cancelReservation(rsvp_ID_1, con, function()
{
	
}); //Assert failure

//Make 2 hours of valid reservations
query.addReservation("G101", "foo1", "02/10/2017", 8, 10, "true", con, function()
{
	
}); //Assert success

//Make 2 hours of valid reservations
query.addReservation("G101", "foo1", "02/10/2017", 9, 10, "true", con, function()
{
	
}); //Assert success

query.getRoomSchedule("G101", "02/10/2017", con, function()
{
	
}); //Assert 2 reservations returned

query.getRoomSchedule("G101", "02/11/2017", con, function()
{
	
}); //Assert 0 reservations returned

query.getAllRooms("02/10/2017", con, function()
{
	
}); //Assert 2 reservations returned

query.getAllRooms("02/10/2017", con, function()
{
	
}); //Assert 0 reervations returned