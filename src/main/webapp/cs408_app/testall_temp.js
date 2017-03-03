    //TEST PASS
    TEST1_PASS:function(callback){
	query.addAccount(account1.email, account1.username, account1.password, con, function(err, res){

	    if(err)
		callback(null, false)
	    else
		callback(null, res.message == 'success');
	})

    },

    //Set sharable status of standing reservation from false to true
    TEST&_PASS:function(callback) {
    	query.setReservationSharable(ID, status, con, function(err, res){
		if(err)
			callback(null, false);
		else
			callback(null, res.message == "success");
	});
    },

    //Set sharable status of standing reservation from true to false
    TEST&_PASS:function(callback) {
     	query.setReservationSharable(ID, status, con, function(err, res){
		if(err)
			callback(null, false);
		else
			callback(null, res.message == "success");
	});   
    },
    
    //Attempt to set status of non-existent reservation
    TEST&_PASS:function(callback) {
      	query.setReservationSharable(ID, status, con, function(err, res){
		if(err)
			callback(null, true );
		else
			callback(null,false );
	});  
    },

    //
    //getUserReservations
    //

    //To remain in database with 1 hr reservations at all times
    var resGetUser1 = {	"email":"restTest1@purdue.edu",
    				"username":"resTest1",
    				"password":"resTest1"
		      };
    //To remain in database with 6 hrs reservations at all times
    var resGetUser2 = {	"email":"resTest2@purdue.edu",
    			"username":"resTest2",
			"password":"resTest2"
		      };

    //To remain in database with no reservations at all times
    var resGetUser3 = {	"email":"resTest3@purdue.edu",
    			"username":"resTest3",
			"password":"resTest3"
		      };

    //First test date. These entries are to remain in the database
    var testDate1 = {
	   {"username": "test1",
	    "roomID": 1,
	    "date": "2018-01-01",
	    "startTime":7,
	    "endTime":9,
	    "shareable":1
	   },
	   {"username": "test1",
	    "roomID": 2,
	    "date": "2018-01-01",
	    "startTime":7,
	    "endTime":9,
	    "shareable":1
	   },
           {"username": "test1",
	    "roomID": 3,
	    "date": "2018-01-01",
	    "startTime":7,
	    "endTime":9,
	    "shareable":1
	   }
    }

    //Second test date. Database is to remain free of any reservations on this date
    var testDate2 = "2018-02-01";

    //Get reservations from user with 1 hr of reservations
    TEST&_PASS:function(callback){
   	query.getUserReservations(resGetUser1.username, con, function(err, res){
	    if(err)
		callback(null, false)
	    else
		callback(null, res.res.length == 1);
	});

    },

    //Get reservations from user with no reservations
    TEST&_PASS:function(callback){
   	query.getUserReservations(resGetUser2.username, con, function(err, res){
	    if(err)
		callback(null, false)
	    else
		callback(null, res.res.length == 6);
	});

    },

    //Get reservations from user with no reservations
    TEST&_PASS:function(callback){
   	query.getUserReservations(resGetUser.username, con, function(err, res){
	    if(err)
		callback(null, false)
	    else
		callback(null, res.res.length == 0);
	});

    },

    //Get reservations from non-existent user
    TEST&_PASS:function(callback){
   	query.getUserReservations("nonUser", con, function(err, res){
	    if(err)
		callback(null, true)
	    else
		callback(null, false);
	});

    },




    //
    //UpdateAccountPassword
    //

    //Update valid user password with correct credentials and valid new password
    TEST&_PASS:function(callback){
        var tempPassword = resGetUser1.password;
	query.updateAccountPassword(resGetUser1.username, resGetUser1.password, "Password69", con, function(err, res){
	    if(err)
		callback(null, false)
	    else
	    {
		callback(null, res.message == "success");

		//Reset password to previous value so this doesn't fail on subsequent tests
		query.updateAccountPassword(resGetUser1.username, "Password69", tempPassword, con, function(err,res){});
	    }
	});
    },
    
    //Update valid user password with correct credentials and invalid new password
    TEST&_PASS:function(callback){
	query.updateAccountPassword(resGetUser1.username, resGetUser1.password, "pswd", con, function(err, res){
	    if(err)
		callback(null, true)
	    else
		callback(null, false);
	});
    },

    //Update valid user password with correct credentials and empty new password
    TEST&_PASS:function(callback){
	query.updateAccountPassword(resGetUser1.username, resGetUser1.password, "", con, function(err, res){
	    if(err)
		callback(null, true)
	    else
		callback(null, false);
	});
    },

    //Update valid user password with incorrect credentials
    TEST&_PASS:function(callback){
	query.updateAccountPassword(resGetUser1.username, "IncorrectPassword", "Password69", con, function(err, res){
	    if(err)
		callback(null, true)
	    else
		callback(null, false);
	});
    },
     
    //Update non-existent user password
    TEST&_PASS:function(callback){
	query.updateAccountPassword("non-user", "IncorrectPassword", "Password69", con, function(err, res){
	    if(err)
		callback(null, true)
	    else
		callback(null, false);
	});
    },
 
//
//GetAllRooms
//

//Get all rooms for a valid date with some reservations
TEST&_PASS:function(callback){
	query.getAllRooms(testDate1[0].date, con, function(err, res){
	    if(err)
	        callback(null, true);
            else
	        callback(null, false);
	});
},

//Get all rooms for a date with no reservations
TEST&_PASS:function(callback){
	query.getAllRooms(testDate2, con, function(err, res){
	    if(err)
	        callback(null, true);
            else
	        callback(null, false);
	});
},

//Get all rooms given a non-date date string
TEST&_PASS:function(callback){
	query.getAllRooms("This is a date", con, function(err, res){
	    if(err)
	        callback(null, err.message == "invalid date");
            else
	        callback(null, false);
	});
}

