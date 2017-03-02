// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var bodyParser = require('body-parser');
var mysql      = require("mysql");
var query      = require('./query');          // our defined api calls
var path = require("path");
var fs = require('fs');


var app        = express();                 // define our app using express
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/../web_src')));


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

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {

    if ('OPTIONS' == req.method) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	res.sendStatus(200);

    }
    else {

	// do logging and validation here
	console.log('>>>[%s]: %s with data: %s',req.method.toUpperCase(), req.url, JSON.stringify(req.body));
	next();
    }

});


router.route('/addAccount')
    .post(function(req, res) {
	query.addAccount(req.body.email,req.body.username,req.body.password,con,function(err){
	    if(err){
		console.error('Request generated an error: ' + err.message);
		res.json({ err: err.message });
	    }
	    else{
		var response = {message: 'Success' };
		console.log("<<<[RESPONSE]: %j", response);
		res.json(response);
	    }

	});
	
    });

router.route('/authAccount')
    .post(function(req, res) {
	query.authAccount(req.body.username,req.body.password,con,function(err,result){
	    if(err){
		console.error('Request generated an error: ' + err.message);
		res.json({ Err: err.message });
	    }

	    var response;
	    
	    if(result){
		response = { message: "authenticated" };
		console.log("<<<[RESPONSE]: %j", response);
		res.sendStatus(200);
		//res.sendFile(path.join(__dirname, '/../web_src/reserve.html'));
	    }
	    else{
		response = { err: "invalid credentials" };
		console.log("<<<[RESPONSE]: %j", response);
		res.json(response);
	    }
	});
	
    });

router.route('/deleteAccount')
    .delete(function(req, res) {
	query.deleteAccount(req.body.email,req.body.password,con,function(err,result){

	    if(err){
		console.error('Request generated an error: ' + err.message);
		res.json({ err: err.message });
	    }
	    else{
		console.log("<<<[RESPONSE]: %j", result);
		res.json(result);
	    }

	});

	
    });

router.route('/getUserHours')
    .post(function(req, res) {
	query.getUserHours(req.body.username,con,function(err,result){
	    if(err){
		console.error('Request generated an error: ' + err.message);
		res.json({ Err: err.message });
	    }

	    console.log("<<<[RESPONSE]: %j", result);
	    res.json(result);
	    
	});
	
    });

router.route('/getRoomBlockedStatus')
    .post(function(req, res) {
	query.getRoomBlockedStatus(req.body.roomID,con,function(err,result){
	    if(err){
		console.error('Request generated an error: ' + err.message);
		res.json({ Err: err.message });
	    }

	    console.log("<<<[RESPONSE]: %j", result);
	    res.json(result);
	    
	});
	
    });

router.route('/setRoomBlockedStatus')
    .post(function(req, res) {
	query.setRoomBlockedStatus(req.body.roomID, req.body.status, con, function(err,result){
	    if(err){
		console.error('Request generated an error: ' + err.message);
		res.json({ Err: err.message });
	    }

	    console.log("<<<[RESPONSE]: %j", result);
	    res.json(result);
	    
	});
	
    });

router.route('/setReservationShareable')
    .post(function(req, res) {
	query.setReservationShareable(req.body.reservationID, req.body.status, con, function(err,result){
	    if(err){
		console.error('Request generated an error: ' + err.message);
		res.json({ Err: err.message });
	    }

	    console.log("<<<[RESPONSE]: %j", result);
	    res.json(result);
	    
	});
	
    });




router.route('/getRoomSchedule')
    .post(function(req, res) {
	query.getRoomSchedule(req.body.roomID, req.body.date, con, function(err, result){
	    if(err){
		console.error('Request generated an error: ' + err.message);
		res.json({ err: err.message });
	    }
	    else{
		console.log("<<<[RESPONSE]: %j", result);
		res.json(result);
	    }

	});

    });


router.route('/getUserReservations')
    .post(function(req, res) {
	query.getUserReservations(req.body.username, con, function(err, result){
	    if(err){
		console.error('Request generated an error: ' + err.message);
		res.json({ err: err.message });
	    }
	    else{
		console.log("<<<[RESPONSE]: %j", result);
		res.json(result);
	    }

	});

    });



router.route('/getAllRooms')
    .post(function(req, res) {
    
	query.getAllRooms(req.body.date, con, function(err, result){
	    if(err){
		console.error('Request generated an error: ' + err.message);
		res.json({ err: err.message });
	    }
	    else{
		console.log("<<<[RESPONSE]: %j", result);
		res.json(result);
	    }

	});

    });

router.route('/addReservation')
    .post(function(req, res) {
	query.addReservation(req.body.roomID, req.body.username, req.body.date, req.body.startTime, req.body.endTime, req.body.shareable, con,function(err,result){
	    if(err){
		console.error('Request generated an error: ' + err.message);
		res.json({ err: err.message });
	    }
	    else{
		var response = {message: 'Success',reservationID: result};
		console.log("<<<[RESPONSE]: %j", response);
		res.json(response);
	    }

	});
	
    });

router.route('/cancelReservation')
    .post(function(req, res) {
	query.cancelReservation(req.body.reservationID,con,function(err,result){
	    if(err){
		res.json({ err: err.message });
	    }
	    else{
		res.json(result);
	    }

	});
	
    });

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server started on port ' + port);

// HOOKS FOR SERVER SHUTDOWN
// this function is called on signal interupts Ctrl-C & Kill
// =============================================================================
var gracefulShutdown = function() {

    console.log("\nReceived kill signal, shutting down gracefully.\n");

    con.end(function(err) {
	// The connection is terminated gracefully
	// Ensures all previously enqueued queries are still
	// before sending a COM_QUIT packet to the MySQL server.
	process.exit();
    });


    // if after
    setTimeout(function() {
	console.error("Could not close connections in time, forcefully shutting down");
	process.exit();
    }, 10*1000);
}

// listen for TERM signal .e.g. kill
process.on ('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on ('SIGINT', gracefulShutdown);  
