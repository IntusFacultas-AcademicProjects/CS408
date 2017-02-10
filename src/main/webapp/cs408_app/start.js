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
      next();
    }
    
    // do logging and validation here
    console.log('Recieved request with data ' + JSON.stringify(req.body));


});

router.route('/addAccount')
    .post(function(req, res) {
	query.addAccount(req.body.email,req.body.username,req.body.password,con,function(err){
	    if(err){
		console.log(err.message);
		res.json({ err: err.message });
	    }
	    else{
		res.json({message: 'Success' });
	    }

	});
	
    });

router.route('/authAccount')
    .post(function(req, res) {
	query.authAccount(req.body.email,req.body.password,con,function(err,result){
	    if(err)
		res.json({ Err: err.message });

	    if(result){
		console.log('good');
		res.json({ msg: "authenticated" });
	    }
	    else
		res.json({ msg: "invalid" });

	});
	
    });

router.route('/deleteAccount')
    .delete(function(req, res) {
	query.deleteAccount(req.body.email,req.body.password,con,function(err,result){
	    console.log('result: ' + result);
	});

	res.json({ message: 'ACK' });
	
    });

router.route('/getRoom')
	.get(function(req, res) {
	    query.getRoom(req.body.room,req.body.date,function(result){
	    	console.log('result: ' + result);
	    });

	    res.json({message: 'ACK'});
    });

router.route('/getAllRooms')
	.get(function(req, res) {
	    query.getAllRooms(req.body.date,function(result){
	    	console.log('result: ' + result);
	    });

	    res.json({message: 'ACK'});
    });

router.route('/setReservation')
    .post(function(req, res) {
	query.setReservation(req.body.room,req.body.username,req.body.day,req.body.start_time, req.body.end_time,req.body.shareable,con,function(err){
	    if(err){
		res.json({ err: err.message });
	    }
	    else{
		res.json({message: 'Success' });
	    }

	});
	
    });

router.route('/cancelReservation')
    .post(function(req, res) {
	query.cancelReservation(req.body.room,req.body.username,req.body.day,req.body.start_time,con,function(err){
	    if(err){
		res.json({ err: err.message });
	    }
	    else{
		res.json({message: 'Success' });
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
