
//All mySQL api queries here


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

var emailExists = function(email,connection,callback) {

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


var addAccount = function(email,username,password,connection,callback) {

    
    emailExists(email,connection,function(err, result){
	if(result){
	    callback(new Error("Email already exists"));
	    console.log("Failed to add account: Email already exists");
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
    
    connection.query('INSERT INTO `reservations` (`room_id`, `username`, `date`, `start_time`, `end_time`, `shareable`) VALUES (?, ?, ?, ?, ?, ?);', [roomID, user, date, startTime, endTime, shareable], function(error,results,fields){

		console.log('Added reservation: ' + result.insertID + '\n');
		
		if(error)
			callback(error);
		else
			callback(null, results);
    });
    
    return true;
};

var cancelReservation = function(reservationID, connection, callback) 
{
    
    connection.query('DELETE FROM reservations WHERE reservation_id LIKE ?', [reservationID], function(error,results,fields){

		if(error)
			callback(error);
		else
			callback(null);
    });

    return true;
};

exports.usernameExists = usernameExists;
exports.addAccount = addAccount;
exports.authAccount = authAccount;
exports.deleteAccount = deleteAccount;
exports.getRoomSchedule = getRoomSchedule;
exports.getAllRooms = getAllRooms;
exports.addReservation = addReservation;
exports.cancelReservation = cancelReservation;