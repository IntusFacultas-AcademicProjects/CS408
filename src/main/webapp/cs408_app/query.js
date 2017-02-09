
//All mySQL api queries here


exports.addAccount = function(email,password,isAdmin,connection,callback) {

    connection.query('INSERT INTO accounts(email,password,is_admin) VALUE (?,?,?)', [email,password,isAdmin] ,function(error,results,fields){
	if(error){
	    throw error;
	    callback(false);
	}
	console.log('Added account: ' + email + ', password: ' + password + '\n');
    });

    callback(true);
    
};

exports.authAccount = function(email,password,connection,callback) {

    connection.query('SELECT * FROM accounts WHERE email LIKE ? AND password LIKE ?', [email,password] ,function(error,results,fields){
	if(error)
	    throw error;
	if(results.length == 1)
	    callback(true);
	else
	    callback(false);
	
    });
};

exports.deleteAccount = function(email,password,connection,callback) {

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

exports.cancelReservation = function cancelReservation(room, user, day, time) {

    connection.query('DELETE FROM reservations WHERE room_id LIKE ? AND start_time LIKE ? AND end_time LIKE ?', [room,start_time,end_time] ,function(error,results,fields){
	if(error)
	    throw error;

	console.log('Added account: ' + email + ', password: ' + password + '\n');
    });

    return true;
    
};

*/
