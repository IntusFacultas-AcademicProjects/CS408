
exports.addAccount = function addAccount(email,password,isAdmin,connection) {

    connection.query('INSERT INTO accounts(email,password,is_admin) VALUE (?,?,?)', [email,password,isAdmin] ,function(error,results,fields){
	if(error)
	    throw error;

	console.log('Added account: ' + email + ', password: ' + password + '\n');
    });

    return true;
    
};
