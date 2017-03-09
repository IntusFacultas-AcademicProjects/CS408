/*
* This file should contain all api calls that query the database.
* All functions should include a connection argument. This is 
* the database connection in which to be used in querying.
*/
var util = require('util');
var moment = require('moment');
var async = require('async');

var usernameExists = function(username,connection,callback) {
   connection.query('SELECT * FROM accounts WHERE username LIKE ?', [username], function(error,results,fields){
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

   connection.query('SELECT * FROM accounts WHERE email LIKE ?', [email], function(error,results,fields){

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
	   callback(new Error("Illegal State: multiple hours results from username " + username));

    });
};




var isConflictingTime = function(roomID, date, startTime, endTime, connection, callback){
    
    connection.query("SELECT * FROM reservations " +
		     "WHERE room_id = ? " +
		     "AND date = ? " +
		     "AND ((HOUR(start_time) > ? AND HOUR(start_time) < ?) " +
		     "OR (HOUR(end_time) > ? AND HOUR(end_time) < ?) " +
		     "OR (HOUR(start_time) = ? AND HOUR(end_time) = ?))",
		     [roomID, date, startTime, endTime, startTime, endTime, startTime, endTime],
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
	}
	
	
    },
    // ...and get the results here
    function(err, results) {
		     
	if(results.usercheck){
	    callback(new Error("username already exists"));
	    return;
	}
	else if(results.emailcheck){
	    callback(new Error("email already exists"));
	    return;
	}
	
	connection.query('INSERT INTO accounts(email,username,password) VALUE (?,?,?)', [email,username,password] ,function(error,results,fields){
    	    if(error){
    		callback(error);
    		return;
    	    }
    	    else{
    		callback(null,{message:'success'});
	    }
		
    	    console.log('Added account: ' + email + ', password: ' + password + '\n');
	});
	
    });
    
};

var authAccount = function(username,password,connection,callback) 
{
	console.log("SELECT * FROM accounts WHERE username LIKE %s AND password LIKE %s\n", username, password);
    connection.query('SELECT * FROM accounts WHERE username LIKE ? AND password LIKE ?', [username,password] ,function(error,results,fields){
	if(error)
	    callback(error)


	if(results.length == 0){
	    callback(null, {"err":"Invalid Credentials"});
	    return
	}
	    
	    
	var isAdmin = (results[0].is_admin == 1 ? true : false);
	
	if(results.length == 1)
	    callback(null, {"message":"Authenticated","data":isAdmin});
	else
	    callback(new Error("Illegal State: multiple values for credential pair"));
	
    });
};


var deleteAccount = function(email,connection,callback) 
{
    connection.query('DELETE FROM accounts WHERE email LIKE ?', [email], function(error,results,fields){
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

    //TODO check roomID exists
    
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

    if(!newPassword.match(/[a-z]/i) || !newPassword.match(/[0-9]/i))
    {
        callback(new Error("invalid password"));
	return;
    }
    connection.query('UPDATE accounts SET password=? WHERE username=? AND password=?', [newPassword, username, oldPassword], function(error,results,fields){

	if(error)
	{
	    callback(new Error(error));
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


var setRoomBlockedStatus = function(roomID, status, connection, callback){


    status = (status ? 1 : 0);
    
    connection.query('UPDATE rooms SET blocked_status=? WHERE room_id=?', [status, roomID], function(error,results,fields){

	if(error)
	    callback(error)
	if(results.affectedRows == 0)
	    callback(null, {"err":"roomID doesn't exist"});
	else if(results.affectedRows == 1)
	    callback(null, {"message":"success"});
	else
	    callback(new Error('illegal state: duplicate blocked_status values'));

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


    connection.query('SELECT reservation_id, username, HOUR(start_time) AS `startTime`, HOUR(end_time) AS `endTime`, shareable, date, room_id AS `roomID` FROM reservations WHERE username=? AND date > CURDATE()', [username], function(error,results,fields){		

	if(error){
	    callback(error);
	    return;
	}

	if(results.length == 0){
	    callback(null, {"res":[]});
	}
	
	results.forEach(function(element, index, array){
	    
	    connection.query('SELECT room_name FROM rooms WHERE room_id=?', [element.roomID], function(error,results,fields){		

		if(error){
		    callback(error);
		    return;
		}
		
		if(results.length == 1){
		    element.roomName = results[0].room_name;
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

var addReservation = function(roomID, user, date, startTime, endTime, shareable, connection, callback) 
{
    //We need synchronous execution here because we need to make sure 
    //input for isConflictingTime() is valid. So we do checking here...
    async.series({

	
	formatcheck: function(callback) {
	    
	    if(startTime < 0 || startTime > 23){
		callback(new Error("startTime out of acceptable range [0,23]"));
		return;
	    }
	    else if(endTime < 0 || endTime > 23){
		callback(new Error("endTime out of acceptable range [0,23]"));
		return;
	    }
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

	//Change params to format we need
	startTime = util.format("0%d:00:00",startTime);
	endTime = util.format("0%d:00:00",endTime);
	shareable = shareable ? 1 : 0;


	connection.query('INSERT INTO `reservations` (`room_id`, `username`, `date`, `start_time`, `end_time`, `shareable`) VALUES (?, ?, ?, ?, ?, ?);',
			 [roomID, user, date, startTime, endTime, shareable], function(error,results,fields){

	    if(error){
		callback(error);
		return;
	    }
            else{
		console.log(util.format("Reservation Added: ID: %d, User: %s, Date: %s, Time:%s-%s",results.insertId,user,date,startTime,endTime));
		callback(null, results.insertId);
	    }

	});
	
    });



};

var cancelReservation = function(reservationID, connection, callback) 
{
    
    connection.query('DELETE FROM reservations WHERE reservation_id LIKE ?', [reservationID], function(error,results,fields){

	if(error)
	    callback(error)
	if(results.affectedRows == 0)
	    callback(new Error("reservation doesnt exist"));
	else if(results.affectedRows == 1)
	    callback(null, {"message":"success"});
	else
	    callback(new Error('illegal state: duplicate resvation IDs'));
	
    });

};

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

