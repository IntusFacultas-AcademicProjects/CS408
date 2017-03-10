/*
* This file should contain all api calls that query the database.
* All functions should include a connection argument. This is
* the database connection in which to be used in querying.
*/
var util = require('util');
var moment = require('moment');
var async = require('async');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'boilersvp@gmail.com', // Your email id
            pass: 'Boilerup' // Your password
        }
    });

function ghettoHash(str){


    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
	var char = str.charCodeAt(i);
	hash = ((hash<<5)-hash)+char;
	hash = hash & hash; 
    }
    // Salting because two passwords shouldn't have same hash.
    var seconds = new Date().getTime() / 1000;
    seconds = seconds / Math.floor(Math.random() * 2000);
    seconds = Math.floor(seconds);
    hash = hash + "" + seconds;
    hash = parseInt(hash);
    return hash;
    
    
}

var usernameExists = function(username,connection,callback) {
   connection.query('SELECT * FROM accounts WHERE username=?', [username], function(error,results,fields){
       if(error){
	   callback(error);
	   return;
       }

       if(results.length == 1)
	   callback(null,true);
       else
	   callback(null,false);

    });
};

var emailExists = function(email,connection,callback) {

   connection.query('SELECT * FROM accounts WHERE email=?', [email], function(error,results,fields){

       if(error){
	   callback(error);
	   return;
       }

       if(results.length == 1)
	   callback(null, true);
       else
	   callback(null, false);

    });
};

var emailIsValid = function(email) {
  return (email.endsWith('@purdue.edu') && email.split('@').length == 2);
}

var passwordIsValid = function(password) {
  if(!password.match(/[a-z]/i) || !password.match(/[0-9]/i
    || !password.match(/[A-Z]/i))) {
      return "password must contain at least one of each: lowercase characters, uppercase characters, and numbers";
  }

  if(password.length < 5) {
    return "password must be at least 5 characters in length";
  }

  if(password.match(/[^0-9a-zA-Z\?\!\.]/i)) {
    return "password may only contain alphanumeric characters or the characters . ? or !";
  }

  return "good";
}

var getUserHours = function(username,connection,callback) {


   connection.query('SELECT hours_remain FROM accounts WHERE username=?', [username], function(error,results,fields){

       if(error){
	   callback(error);
	   return;
       }


       if(results.length == 1)
	   callback(null, {"data":results[0].hours_remain});
       else if(results.length == 0)
	   callback(null, {"err":"username doesn't exist"});
       else
	   callback(new Error("Illegal State: multiple results from username " + username));

    });
};

var addDeltaUserHours = function(username,value,connection,callback) {
    connection.query('UPDATE accounts SET hours_remain=hours_remain+? WHERE username=?', [value,username], function(error,results,fields){

	if(error){
	    callback(error);
	    return;
	}

	if(results.affectedRows == 1)
	   callback(null, {"message":"success"});
	else if(results.affectedRows == 0)
	    callback(null, {"err":"username doesn't exist"});
	else
	    callback(new Error("Illegal State: multiple results from username " + username));

    });
};

var isConflictingTime = function(roomID, date, startTime, endTime, connection, callback){
    connection.query("SELECT * FROM `reservations` WHERE room_id='?' AND date=? AND ((HOUR(start_time) < ? AND HOUR(end_time) > ?) OR (HOUR(end_time) > ? AND HOUR(end_time) < ?) OR (HOUR(start_time) > ? AND HOUR(start_time) < ?) OR (HOUR(start_time) > ? AND HOUR(end_time) < ?))",
		     [roomID, date, startTime, endTime,startTime, endTime,startTime,endTime,startTime, endTime],
		     function(err, res, fields){
			 if(err){
			     callback(err)
			     return;
			 }

			 if(res.length == 0){
			     callback(null, false);
			 }
			 else {
			     callback(null, true);
			 }

		     });

}

var addAccount = function(email,username,password,connection,callback) {

    //We do all error checking in parallel here...
    async.parallel({


	emailcheck: function(callback) {
	    emailExists(email,connection,function(err,res){
		callback(err, res);
	    });
	},

	usercheck: function(callback) {
	    usernameExists(username,connection,function(err,res){
		callback(err, res);
	    });
	},

	validEmailCheck: function(callback) {
		if(!emailIsValid(email))
			callback(new Error("bad email"), null);
		else
			callback(null, null);
	},

	passwordCheck: function(callback) {
		var passwordRes = passwordIsValid(password);
		if(passwordRes != "good")
			callback(new Error(passwordRes), null);
		else
			callback(null, null);
	}


    },
    // ...and get the results here
    function(err, results) {

	if(results.usercheck){
	    callback(new Error("username already exists"));
	    return;
	}
	else if(results.emailcheck){
	    console.log(JSON.stringify(results.emailCheck));
	    callback(new Error("email already exists"));
	    return;
	}
	else if(results.validEmailCheck){
	    callback(new Error("bad email"));
	    return;
	}
	else if(results.passwordCheck){
	    callback(new Error("bad password"));
	    return;
	}

	var pin = Math.floor(Math.random() * 2000000);
	connection.query('INSERT INTO accounts(email,username,password,pin) VALUE (?,?,?,?)', [email,username,password,pin] ,function(error,results,fields){
	

    	    if(error){
    		callback(error);
    		return;
    	    }
    	    else{
    		
    		var mailOptions = {
				from: 'boilersvp@gmail.com', // sender address
				to: email, // list of receivers
				subject: 'Account Verification', // Subject line
				text: "Thanks for signing up to Purdue RSVP! Your Pin is: " + pin + "\n\n\n Please do not respond to this email. This is an automated message and not supervised."
			};
			
			transporter.sendMail(mailOptions, function(error, info){
				if(error){
					console.log(error);
				}else{
					console.log('Message sent: ' + info.response);
				};
			});
			callback(null,{message:'success'});
	    }

    	    console.log('Added account: ' + email + ', password: ' + password + '\n');
	});

    });
};

var authAccount = function(username,password,adminTok,connection,callback)
{

    connection.query('SELECT * FROM accounts WHERE username=? AND password=?', [username,password] ,function(error,results,fields){

	if(error){
	    callback(error)
	    return;
	}

	if(results.length == 0){
	    callback(new Error("Invalid Credentials"));
	    return
	}


	var isAdmin = (results[0].is_admin == 1 ? true : false);
	var adminTok = null;
	var verified = results[0].pin_verified;
	if(isAdmin){
	    adminTok = ghettoHash(password);
	}

	connection.query('UPDATE accounts SET admin_token=? WHERE username=?', [adminTok, username], function(error,results,fields){
	    if(error){
		console.log(error.message);
		console.log("Error setting admin token");
	    }
	});
	
	if(results.length == 1)
	    callback(null, {"message":"Authenticated","data":isAdmin,"adminTok":adminTok, "ver":verified});
	else
	    callback(new Error("Illegal State: multiple values for credential pair"));

    });
};

var deleteAccount = function(email,connection,callback) {
    connection.query('DELETE FROM accounts WHERE email=?', [email], function(error,results,fields){
	if(error)
	    throw error;
	if(results.affectedRows == 1)
	    callback(null, {message:'success'});
	else if(results.affectedRows == 0)
	    callback(new Error('account doesnt exist'));
	else
	    callback(new Error('Illegal state'));

    });
};

var getRoomBlockedStatus = function(roomID, connection, callback){


    connection.query('SELECT blocked_status FROM rooms WHERE room_id=?', [roomID], function(error,results,fields){

	if(results.length == 1){
	    callback(null,{"data":(results[0].blocked_status == 1 ? true: false)});
	}
	else{
	    callback(new Error("Illegal state: multiple blocked results for roomID: " + roomID));
	}

    });


};

var updateAccountPassword = function(username, oldPassword, newPassword, connection, callback){
  var passCheck = passwordIsValid(newPassword);
  if(passCheck != "good") {
    callback(new Error(passCheck));
    return;
  }

  connection.query('UPDATE accounts SET password=? WHERE username=? AND password=?', [newPassword, username, oldPassword], function(error,results,fields){
  	if(error)
  	{
	    callback(new Error(error));
      return;
  	}
  	if(results.affectedRows == 0)
  	{
	    callback(new Error("invalid credentials"));
  	}
  	else if(results.affectedRows == 1)
  	{
	    callback(null, {"message":"success"});
  	}
  	else
  	{
	    callback(new Error('illegal state: multiple results for user and pass'));
  	}
  });
};

var authorizePin = function(username, pin, connection, callback) {
	connection.query('SELECT * FROM accounts WHERE username=?', [username], function(error, results, fields) {
		if (error) {
			callback(new Error("Account verification failed. Contact system administrator for manual verification"));
		}
		if (results[0].pin != pin) {
			callback(null, {"err": "Entered pin is incorrect"});
		}
		else {
			connection.query('UPDATE accounts SET pin_verified=1 WHERE username=?', [username], function(error,results,fields){


			});
			callback(null, {"message":"success"});
		}
	});
}
/*
	make field 
	var authorizePin = function() {
		query)(user) if pin = pin success
		else error
	}
*/


var setRoomBlockedStatus = function(roomID, status, adminTok, connection, callback){

    connection.query('SELECT * FROM accounts WHERE admin_token=?', [adminTok], function(error,results,fields){


	if(results.length != 1){
	    callback(new Error("AdminTok does not match"));
	    return;
	}
	
	status = (status ? 1 : 0);
	connection.query('UPDATE rooms SET blocked_status=? WHERE room_id=?', [status, roomID], function(error,results,fields){

	    if(error)
		callback(error)
	    if(results.affectedRows == 0)
		callback(null, {"err":"roomID doesn't exist"});
	    else if(results.affectedRows == 1) {
	    	if (status) {
	    		connection.query('SELECT *, HOUR(start_time) AS `startTime`, HOUR(end_time) AS `endTime` FROM reservations WHERE room_id=?', [roomID],function(error,results,fields) {
					var roomNames = ["G118", "G119", "G120", "G121", "G122", "G123", "G124", "G125", "G126", "G127", "G128", "G129", "G130", "G131", "G132", "G133", "G134", "G135", "G136"];
					async.times(results.length, function(i, next) {
						console.log("In times: " + JSON.stringify(results[i]));
						cancelReservation(results[i].reservation_id, connection,function(err,res){
							console.log("In cancel: " + JSON.stringify(results[i]));
							connection.query("SELECT * FROM `accounts` WHERE username=?", [results[i].username],function(error,inner_results,fields) {
								console.log("found: " + JSON.stringify(inner_results));
								var text = "We regret to inform you that an administrator has blocked a room you had a reservation in.\n"+
								"We've refunded the hours for the following reservation:\n\n"+
								"Reservation ID: " + results[i].reservation_id+"\n"+
								"Room: " + roomNames[results[i].room_id] +"\n"+
								"Start Time: " + results[i].start_time +"\n"+
								"End Time: " + results[i].end_time+" *note that your reservation technically ends 1 minute before this time\n"+
								"We apologize for the inconvenience.\nGood luck on your studying!\n\n\n Please do not respond to this email. This is an automated message and not supervised.";
								var mailOptions = {
									from: 'boilersvp@gmail.com', // sender address
									to: inner_results[0].email, // list of receivers
									subject: 'Reservation Cancellation', // Subject line
									text: text
								};
			
								transporter.sendMail(mailOptions, function(error, info){
									if(error){
										console.log(error);
									}else{
										console.log('Message sent: ' + info.response);
									};
								});			
							});							
						});	
					}, function(err, users) {
						callback(null, {"message":"success"});
					});
				});
	    	}
	    	else {
	    		callback(null, {"message":"success"});
	    	}
			
		}
	    else
		callback(new Error('illegal state: duplicate blocked_status values'));

	});
    });

};

var setReservationShareable = function(reservationID, status, connection, callback){


    //TODO check reservationID exists

    status = (status ? 1 : 0);

    connection.query('UPDATE reservations SET shareable=? WHERE reservation_id=?', [status, reservationID], function(error,results,fields){

	if(error)
	    callback(error)

	if(results.affectedRows == 1)
	    callback(null, {"message":"success"});
	else if(results.affectedRows == 0)
	    callback(new Error("Could not get sharable status for reservation_id: " + reservationID));
	else
	    callback(new Error('illegal state: duplicate shareable values'));

    });


};

var getAllRooms = function(date, connection, callback){

    var roomsData = {
	"rooms" : []
    }


    if(!moment(date, "YYYY-MM-DD", true).isValid()){
	callback(new Error("invalid date"));
	return;
    }

    connection.query('SELECT * FROM rooms', function(error,results,fields){

	//Iterate over all rooms in database
	results.forEach(function(element, index, array){

	    if(error){
		callback(error);
		return;
	    }

	    var roomObj = {}

	    //Set room data here
	    roomObj.roomid = element.room_id;
	    roomObj.roomName = element.room_name;
	    roomObj.date = date;
	    roomObj.blocked = element.blocked_status == 1 ? true : false;

	    //Get all reservations for room here
	    connection.query('SELECT reservation_id, username, HOUR(start_time) AS `startTime`, HOUR(end_time) AS `endTime`, shareable FROM reservations WHERE room_id = ? AND date = ?',
			     [element.room_id, date], function(error,results,fields){
		if(error){
		    callback(error);
		    return;
		}


		roomObj.res = results;
		roomsData.rooms.push(roomObj);

		if(index + 1  == array.length){
		    callback(null,roomsData);
		}


	    });

	});

    });

};

var getUserReservations = function(username, connection, callback){


    connection.query('SELECT reservation_id, username, HOUR(start_time) AS `startTime`, HOUR(end_time) AS `endTime`, shareable, date, room_id AS `roomID` FROM reservations WHERE username=? AND date >= CURDATE()', [username], function(error,results,fields){

	if(error){
	    callback(error);
	    return;
	}

	if(results.length == 0){
	    callback(null, {"res":[]});
	    return;
	}

	results.forEach(function(element, index, array){

	    connection.query('SELECT room_name, blocked_status FROM rooms WHERE room_id=?', [element.roomID], function(error,results,fields){

		if(error){
		    callback(error);
		    return;
		}

		if(results.length == 1){
		    element.roomName = results[0].room_name;
		    element.blockedStatus = results[0].blocked_status;
		}
		else if(results.length == 0){
		    callback(new Error("Could not fetch roomName for roomID: " + element.roomID));
		    return;
		}
		else{
		    callback(new Error("Illegal state: multiple roomNames for roomID: " + element.roomID));
		    return;
		}



		if(index + 1  == array.length){
		    callback(null,{"res":array});
		}


	    });


	});

    });

};

var getRoomSchedule = function(roomID, date, connection, callback){

    var roomObj = {}

    if(!moment(date, "YYYY-MM-DD", true).isValid()){
	callback(new Error("invalid date"));
	return;
    }


    connection.query('SELECT * FROM rooms WHERE room_id = ?', [roomID], function(error,results,fields){

	if(error){
	    callback(error);
	    return;
	}
	else if(results.length == 0){
	    callback(null, {"err":"room does not exist"});
	    return;
	}
	else if(results.length > 1){
	    callback(new Error("invalid state: duplicate rooms in database"));
	    return;
	}



	//Set room data here
	roomObj.roomID = results[0].room_id;
	roomObj.roomName = results[0].room_name;
	roomObj.date = date;
	roomObj.blocked = results[0].blocked == 1 ? true : false;

	//Get all reservations for room here
	connection.query('SELECT reservation_id, username, HOUR(start_time) AS `startTime`, HOUR(end_time) AS `endTime`, shareable FROM reservations WHERE room_id = ? AND date = ?', [roomID, date], function(error,results,fields){
	    if(error){
		callback(error);
		return;
	    }

	    roomObj.reservations = results;
	    callback(null,roomObj);

	});

    });

};

/*
*     Database requires data to be inserted in the folling format:
*     -----------------------------------------------------------
*     room_id:      unique character string
*     username:     unique character string
*     day:          YYYY-MM-DD
*     start_time:   HH:MM:SS
*     end_time:     HH:MM:SS
*     shareable:    "TRUE" || "FALSE"
*/

var addReservation = function(roomID, user, date, startTime, endTime, shareable, connection, callback) {

	
    //We need synchronous execution here because we need to make sure
    //input for isConflictingTime() is valid. So we do checking here...
    async.series({ 

	allowanceCheck: function(callback) {
	   connection.query('SELECT hours_remain FROM accounts WHERE username=?', [user], function(error,results,fields){
       if(error){
    	   callback(error);
    	   return;
       }

       if(results.length == 1) {
  		   var used = endTime - startTime;
  		   if (used > results[0].hours_remain) {
  		   		callback(new Error("Reservation failed: This reservation exceeds your allotted allowance."));
  		   		return;
  		   }
  		   else {
  		   		callback(null);
  		   }

       }
       else if(results.length == 0)
	      callback(new Error("Illegal State: no results from username " + user));
       else
        callback(new Error("Illegal State: multiple results from username " + user));

    });
	},
	formatcheck: function(callback) {

	    if(startTime < 0 || startTime > 23){
		callback(new Error("startTime out of acceptable range [0,23]"));
		return;
	    }
	    /*else if(endTime < 0 || endTime > 23){
		callback(new Error("endTime out of acceptable range [0,23]"));
		return;
	    }*/
	    else if(startTime >= endTime){
		callback(new Error("startTime must be less than endTime"));
		return;
	    }
	    else if(!moment(date, "YYYY-MM-DD", true).isValid()){
		callback(new Error("invalid date"));
		return;
	    }
	    else{
		callback(null, true);
	    }

	},

	conflictcheck: function(callback) {

	    isConflictingTime(roomID, date, startTime, endTime, connection, function(err, res){
		if(err)
		    callback(err)
		else if(res)
		    callback(new Error("conflicting reservation time"));
		else
		    callback(null,true);
	    });

	}

    },
    // ...and get the results here
    function(err, results) {


	//Since we only callback with errors above, they should
	//be caught here where we then forward them back to the callee
	if(err){
	    callback(err);
	    return;
	}


	connection.query('UPDATE accounts SET hours_remain = hours_remain - ? WHERE username=?',[endTime-startTime,user], function(error,results,fields){

	    if(error){
		callback(error);
		return;
	    }

	    if(results.affectedRows != 1){
		callback(new Error("Could not remove hours from user"));
		return;
	    }

	    //Change params to format we need
	    startTime = util.format("0%d:00:00",startTime);
	    endTime = util.format("0%d:00:00",endTime);
	    shareable = shareable ? 1 : 0;


	    connection.query('INSERT INTO `reservations` (`room_id`, `username`, `date`, `start_time`, `end_time`, `shareable`) VALUES (?, ?, ?, ?, ?, ?);', [roomID, user, date, startTime, endTime, shareable], function(error,insertResults,fields){

		if(error){
		    callback(error);
		    return;
		}
		else{

			console.log(util.format("Reservation Added: ID: %d, User: %s, Date: %s, Time:%s-%s",insertResults.insertId,user,date,startTime,endTime));
		    callback(null, {"data":results.insertId});

		}
	    });

	});
    });
}

var cancelReservation = function(reservationID, connection, callback){
    async.waterfall([

	//Get reservation data
	function(callback) {
	    connection.query('SELECT username, HOUR(start_time) AS `startTime`, HOUR(end_time) AS `endTime` FROM reservations WHERE reservation_id=?', [reservationID], function(error,results,fields){
		if(error)
		    callback(error)
		else if(results.length == 1)
		    callback(null, results[0].username, results[0].endTime-results[0].startTime);
		else if(results.length == 0)
		    callback(new Error("Reservation doesn't exist"));
		else
		    callback(new Error("illegal state: multiple results for unique reservation_id"));
	    });


	},

	//Return user hours
	function(username, value, callback){
	    connection.query('UPDATE accounts SET hours_remain=hours_remain+? WHERE username=?', [value,username], function(error,results,fields){

		if(error)
		    callback(error);
		else if(results.affectedRows == 1)
		    callback(null);
		else if(results.affectedRows == 0)
		    callback(new Error("User doesn't exist"));
		else
		    callback(new Error("Illegal State: multiple results from username " + username));

	    });
	},

	//Delete reservation
	function(callback) {
	    connection.query('DELETE FROM reservations WHERE reservation_id=?', [reservationID], function(error,results,fields){

		if(error)
		    callback(error)
		if(results.affectedRows == 0)
		    callback(new Error("reservation doesnt exist"));
		else if(results.affectedRows == 1)
		    callback(null, {"message":"success"});
		else
		    callback(new Error('illegal state: duplicate resvation IDs'));

	    });

	}

    ],function(err, results) {

	if(err)
	    callback(err);
	else
	    callback(null, results);

    });
};

var getExpiredReservations = function(connection, callback){

    connection.query('SELECT reservation_id AS `reservationID`, username, HOUR(start_time) AS `startTime`, HOUR(end_time) AS `endTime`, date FROM reservations WHERE date < CURDATE()', function(error,results,fields){

	if(error){
	    console.log(err.message);
	    callback(error);
    
	}
	else
	    callback(null,results);
    });
}

var removeExpiredReservations = function(connection, callback){

    async.waterfall([

	//Get expired reservations
	function(callback){
	    getExpiredReservations(connection, function(err, res){

		if(err)
		    callback(err);
		else
		    callback(null,res);
	    });
	},

	function(reservations, callback){
	    reservations.forEach(function(element, index, array){

		errCount = 0;
		cancelReservation(element.reservationID, connection, function(err, res){

		    if(err){
			errCount++;
		    }

		});
		
		if(index + 1  == array.length){

		    if(errCount == 0)
			callback(null, {"data":array.length});
		    else
			callback(new Error("%d of %d removed",array.length-errCount,array.length));
		}

	    });
	}

    ],function(err,result){

	if(err)
	    callback(err);
	else
	    callback(null,result);
    });

}

exports.emailExists = emailExists;
exports.usernameExists = usernameExists;
exports.addAccount = addAccount;
exports.authAccount = authAccount;
exports.deleteAccount = deleteAccount;
exports.updateAccountPassword = updateAccountPassword;
exports.setReservationShareable = setReservationShareable;
exports.getUserHours = getUserHours;
exports.getRoomBlockedStatus = getRoomBlockedStatus;
exports.setRoomBlockedStatus = setRoomBlockedStatus;
exports.getRoomSchedule = getRoomSchedule;
exports.getUserReservations = getUserReservations;
exports.getAllRooms = getAllRooms;
exports.addReservation = addReservation;
exports.cancelReservation = cancelReservation;
exports.getExpiredReservations = getExpiredReservations;
exports.removeExpiredReservations = removeExpiredReservations;
exports.authorizePin = authorizePin;
