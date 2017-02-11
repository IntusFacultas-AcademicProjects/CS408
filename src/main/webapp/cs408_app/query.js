
//All mySQL api queries here

var util = require('util');
var moment = require('moment');

var usernameExists = function(username,connection,callback) 
{
   connection.query('SELECT * FROM accounts WHERE username LIKE ?', [username] ,function(error,results,fields){
       if(error){
	   callback(error);
	   return;
       }
       
       if(results.length == 1)
	   callback(true);
       else
	   callback(false);
	
    });
};

var emailExists = function(email,connection) {

   connection.query('SELECT * FROM accounts WHERE email LIKE ?', [email] ,function(error,results,fields){

       if(error){
	   throw error;
       }

       if(results.length == 1)
	   callback(null, true);
       else
	   callback(null, false);
	
    });
};

var isConflictingTimeSlot = function(date, startTime, endTime, connection, callback){

    connection.query("SELECT * FROM reservations " +
		     "WHERE date = ? " +
		     "AND ((HOUR(start_time) > ? AND HOUR(start_time) < ?) " +
		     "OR (HOUR(end_time) > ? AND HOUR(end_time) < ?))",
		     [date, startTime, endTime, startTime, endTime],
		     function(err, res, fields){
			 
			 if(res.length == 0){
			     callback(null, true);
			 }
			 else if(res.length == 1){
			     callback(null, false);
			 }
			 else{
			     callback(new Error("Invalid state"));
			 }
			     

		     });


}


var addAccount = function(email,username,password,connection,callback) {

    
    emailExists(email,connection,function(err, result){
	if(result){
	    callback(new Error("Email already exists"));
	    return;
	}

	usernameExists(username,connection,function(err, result){
	    if(result){
		callback(new Error("Username already exists"));
		return;
	    }

	    connection.query('INSERT INTO accounts(email,username,password) VALUE (?,?,?)', [email,username,password] ,function(error,results,fields){
		if(error){
		    callback(error);
		    return;
		}
		else
		    callback(null);

		console.log('Added account: ' + email + ', password: ' + password + '\n');
	    });

	});
	
    });
};

var authAccount = function(email,password,connection,callback) 
{
    connection.query('SELECT * FROM accounts WHERE email LIKE ? AND password LIKE ?', [email,password] ,function(error,results,fields){
	if(error)
	    callback(error)
	    
	if(results.length == 1)
	    callback(null, true);
	else
	    callback(null, false);
	
    });
};

var deleteAccount = function(email,password,connection,callback) 
{
    connection.query('DELETE FROM accounts WHERE email LIKE ? AND password LIKE ?', [email,password] ,function(error,results,fields){
	if(error)
	    throw error;
	if(results.affectedRows == 1)
	    callback(true);
	else if(results.affectedRows == 0)
	    callback(false);
	else
	    throw new Error('Illegal state');
	
    });
};

var getAllRooms = function(day)
{
	connection.query('SELECT * FROM reservations WHERE date = ?' 
	[day], function(err,rows)
	{
		if(err) throw err;
		
		console.log('Data received from Db:\n');
		console.log(rows);
	});
};

var getRoomSchedule = function(room, day)
{
	connection.query("SELECT * FROM rooms WHERE room_id = ? AND date = ?"
	[room, day],
	function(error,results,fields)
	{
		if(error) throw error;
		
		console.log('Data received from Db:\n');
		console.log(rows);
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

    //usernameExists(user,connection,function()
    
    //TODO check username exists
    //TODO check if timeslot is taken
		   
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
    // else if(isConflictTimeSlot(date,startTime, endTime, function(err, res){






    // })){
    // 	callback(new Error("Conflicting timeslot"));
    // 	return;
		
    // }

    		   
    //We dont want these values 0-indexed
    startTime += 1;
    endTime +=1;

    //Change params to format we need
    startTime = util.format("0%d:00:00",startTime);
    endTime = util.format("0%d:00:00",endTime);
    shareable = shareable ? 1 : 0;
    
    
    connection.query('INSERT INTO `reservations` (`room_id`, `username`, `date`, `start_time`, `end_time`, `shareable`) VALUES (?, ?, ?, ?, ?, ?);', [roomID, user, date, startTime, endTime, shareable], function(error,results,fields){

	if(error){
	    callback(error);
	}
	else{
	    console.log(util.format("Reservation Added: ID: %d, User: %s, Date: %s, Time:%s-%s",results.insertId,user,date,startTime,endTime));
	    callback(null, results.insertId);
	}

    });

};

var cancelReservation = function(reservationID, connection, callback) 
{
    
    connection.query('DELETE FROM reservations WHERE reservation_id LIKE ?', [reservationID], function(error,results,fields){

	if(error)
	    callback(error)
	if(results.affectedRows == 0)
	    callback(new Error("reservation doesn't exist"));
	else if(results.affectedRows == 1)
	    callback(null, true);
	else
	    throw new Error('Illegal state');
	
    });

};

exports.usernameExists = usernameExists;
exports.addAccount = addAccount;
exports.authAccount = authAccount;
exports.deleteAccount = deleteAccount;
exports.getRoomSchedule = getRoomSchedule;
exports.getAllRooms = getAllRooms;
exports.addReservation = addReservation;
exports.cancelReservation = cancelReservation;
