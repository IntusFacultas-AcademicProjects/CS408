
//All mySQL api queries here


var usernameExists = function(username,connection,callback) {

   connection.query('SELECT * FROM accounts WHERE username LIKE ?', [username] ,function(error,results,fields){
	if(error)
	    throw error;

	if(results.length == 1)
	    callback(true);
	else
	    callback(false);
	
    });
};


var addAccount = function(email,password,isAdmin,connection,callback) {

    connection.query('INSERT INTO accounts(email,password,is_admin) VALUE (?,?,?)', [email,password,isAdmin] ,function(error,results,fields){
	if(error){
	    throw error;
	    callback(false);
	}
	console.log('Added account: ' + email + ', password: ' + password + '\n');
    });

    callback(true);
    
};

var authAccount = function(email,password,connection,callback) {

    connection.query('SELECT * FROM accounts WHERE email LIKE ? AND password LIKE ?', [email,password] ,function(error,results,fields){
	if(error)
	    throw error;
	if(results.length == 1)
	    callback(true);
	else
	    callback(false);
	
    });
};

var deleteAccount = function(email,password,connection,callback) {

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
/*
var setReservation = function(room, user, day, timeStart, timeEnd, shareable, connection, callback) {


    usernameExists(user,connection,function(
	
    ));
    
    
    
    
    connection.query('INSERT INTO `reservations` (`reservation_id`, `username`, `room_id`, `date`, `start_time`, `end_time`, `shareable`) VALUES (NULL, ?, ?, ?, ?, ?, ?);', [user,start_time,end_time] ,function(error,results,fields){
	if(error)
	    throw error;

	console.log('Added account: ' + email + ', password: ' + password + '\n');
    });

    return true;
    
};
*/

/*

exports.cancelReservation = function cancelReservation(room, user, day, time) {

    connection.query('DELETE FROM reservations WHERE room_id LIKE ? AND start_time LIKE ? AND end_time LIKE ?', [room,start_time,end_time] ,function(error,results,fields){
	if(error)
	    throw error;

	console.log('Added account: ' + email + ', password: ' + password + '\n');
    });

    return true;
    
};

*/


exports.usernameExists = usernameExists;
exports.addAccount = addAccount;
exports.authAccount = authAccount;
exports.deleteAccount = deleteAccount;
//exports.setReservation = setReservation;
