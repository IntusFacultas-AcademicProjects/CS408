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
var schedule = require('node-schedule');

var app        = express();                 // define our app using express


const MSG_SUCCESS = {'message':'success'};


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
});

app.use('/*', express.static('../web_src/login.html'));
//Create Universal response functions
app.response.logAndSend = function(obj) {
    console.log('<<<[RESPONSE]: %j', obj);
    this.json(obj);
};
app.response.errAndSend = function(err) {

    var obj = {};
    obj.err = err.message;
    
    console.log('\x1b[33m%s\x1b[0m: ', 'Request generated an Error: ' + err.message);    
    console.log('<<<[RESPONSE]: %j', obj);
    this.json(obj);

};


console.log("Starting hourly cleanup routine");
//Schedule job to run hourly
var j = schedule.scheduleJob('0 0 * * * *', function(){

    query.removeExpiredReservations(con, function(err,res){

	if(err){
	    console.log("Could not remove all expired reservations: " + err.message);
	}
	else{
	    console.log("Removed %d expired reservations", res.data);
	}
	    	    
    });
    
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

	//Do Request logging here
	console.log('>>>[%s]: %s with data: %s',req.method.toUpperCase(), req.url, JSON.stringify(req.body));
	next();
    }

});

app.get('/', function (req, res) {
   res.render('login.html');
})

router.route('/addAccount')
    .post(function(req, res) {
	query.addAccount(req.body.email,req.body.username,req.body.password,con,function(err){

	    if(err)
		res.errAndSend(err);
	    else
		res.logAndSend(MSG_SUCCESS);

	});
    });

router.route('/authAccount')
    .post(function(req, res) {
	query.authAccount(req.body.username,req.body.password,req.body.adminTok,con,function(err,result){

	    if(err)
	    	res.errAndSend(err);
	    else
	    	res.logAndSend(result);

	});
    });

router.route('/deleteAccount')
    .delete(function(req, res) {
	query.deleteAccount(req.body.email,req.body.password,con,function(err,result){

	    if(err)
	    	res.errAndSend(err);
	    else
	    	res.logAndSend(result);

	});
    });
router.route('/authorizePin').post(function(req,res) {
	query.authorizePin(req.body.username,req.body.pin, con, function(err, result) {
		if (err)
			res.errAndSend(err);
		else
			res.logAndSend(result);
	});
});
router.route('/recoverPassword').post(function(req,res) {
    query.recoverPassword(req.body.email,con,function(err,result) {
        if (err)
            res.errAndSend(err);
        else
            res.logAndSend(result);
    });
});
router.route('/updateAccountPassword')
    .post(function(req, res) {
	query.updateAccountPassword(req.body.username,req.body.oldPassword,req.body.newPassword,con,function(err,result){

	    if(err)
	    	res.errAndSend(err);
	    else
	    	res.logAndSend(result);
	    
	});
    });

router.route('/getUserHours')
    .post(function(req, res) {
	query.getUserHours(req.body.username,con,function(err,result){

	    if(err)
	    	res.errAndSend(err);
	    else
	    	res.logAndSend(result);
	    
	});
    });

router.route('/getRoomBlockedStatus')
    .post(function(req, res) {
	query.getRoomBlockedStatus(req.body.roomID,con,function(err,result){

	    if(err)
		res.errAndSend(err);
	    else
		res.logAndSend(result);

	});
    });

router.route('/setRoomBlockedStatus')
    .post(function(req, res) {
	query.setRoomBlockedStatus(req.body.roomID, req.body.status, req.body.adminTok, con, function(err,result){

	    if(err)
		res.errAndSend(err);
	    else
		res.logAndSend(result);

	});
    });

router.route('/setReservationShareable')
    .post(function(req, res) {
	query.setReservationShareable(req.body.reservationID, req.body.status, con, function(err,result){

	    if(err)
		res.errAndSend(err);
	    else
		res.logAndSend(result);
	    
	});
    });


router.route('/getRoomSchedule')
    .post(function(req, res) {
	query.getRoomSchedule(req.body.roomID, req.body.date, con, function(err, result){

 	    if(err)
		res.errAndSend(err);
	    else
		res.logAndSend(result);
	     	     
	});
    });

router.route('/getUserReservations')
    .post(function(req, res) {
	query.getUserReservations(req.body.username, con, function(err, result){

	    if(err)
		res.errAndSend(err);
	    else
		res.logAndSend(result);

	});
    });

router.route('/getAllRooms')
    .post(function(req, res) {
	query.getAllRooms(req.body.date, con, function(err, result){

	    if(err)
		res.errAndSend(err);
	    else
		res.logAndSend(result);

	});
    });

router.route('/addReservation')
    .post(function(req, res) {
	query.addReservation(req.body.roomID, req.body.username, req.body.date, req.body.startTime, req.body.endTime, req.body.shareable, con,function(err,result){

	    if(err)
		res.errAndSend(err);
	    else
		res.logAndSend(result);

	});
    });

router.route('/cancelReservation')
    .post(function(req, res) {
	query.cancelReservation(req.body.reservationID,con,function(err,result){

	    if(err)
		res.errAndSend(err);
	    else
		res.logAndSend(result);

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
	j.cancel();
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
