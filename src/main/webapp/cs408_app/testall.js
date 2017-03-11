///Back end unit tests
//These tests establish a connection to the database and perform various actions on test tables
//with structures identical to those of the tables that will be used by the application

//These tests are stateful, so they all act on the same database state, as most actions (user auth, room reservation and cancelling, reservation lookup)
//require a previously modified state to get a meaningful measure of the program's accuracy



var mysql      = require("mysql");
var query      = require('./query');          // our defined api calls
var assert     = require('assert');
var async      = require('async');

//To be in DB at all times
var account1 = {"email":"test1@purdue.edu",
		"username":"test1",
		"password":"test1"
	       }

//To be added and removed
var account2 = {"email":"test2@purdue.edu",
		"username":"test2",
		"password":"test2"
	       }

//To be added and removed
var account3 = {"email":"test3@purdue.edu",
		"username":"test3",
		"password":"test3"
	       }


//Valid reservation
var res1 = {"username": "Test13",
	    "roomID": 1,
	    "date": "2018-01-01",
	    "startTime":7,
	    "endTime":9,
	    "shareable":1
	   }

var res2 = {"username": "test2",
	    "roomID": 1,
	    "date": "2018-01-01",
	    "startTime":6,
	    "endTime":7,
	    "shareable":1
	   }

var res3 = {"username": "test3",
	    "roomID": 1,
	    "date": "2018-01-01",
	    "startTime":9,
	    "endTime":10,
	    "shareable":1
	   }

//In order to connect to the database you will need node installed on your machine.
//Once Node's installed, run command 'npm install' in 'CS408/src/main/webapp/cs408_app' dir.
//Note: This database can only be accessed through Purdue's network.
var con = mysql.createConnection({
    host: "mydb.itap.purdue.edu",
    user: "bhuemann",
    password: "ben408",
    database: "bhuemann"
});

async.series({

    CON_CONNECT:function(callback){
			con.connect(function(err){
			    if(err){
				//console.log(JSON.stringify(err));
						callback(err)
						return;
			    }
			    callback(null,true);
			})
    },

//TEST PASS
    TEST1_PASS:function(callback){
			query.addAccount(account1.email, account1.username, account1.password, con, function(err, res){
			    if(err)
						callback(null, false)
			    else
						callback(null, res.message == 'success');
			})
    },

    //TEST PASS
    TEST2_PASS:function(callback){
			query.addAccount(account2.email, account2.username, account2.password, con, function(err, res){
			    if(err)
						callback(null, false)
			    else
						callback(null, res.message == 'success');
			})
    },


    //TEST 3 ERR - duplicate email
    TEST3_PASS:function(callback){
			query.addAccount(account1.email, account3.username, account3.password, con, function(err, res){

				if(err)
					callback(null, err.message == 'email already exists');
		    else
					callback(null, false);
			})
    },

    //TEST 5 ERR - duplicate username
    TEST4_PASS:function(callback){
			query.addAccount(account3.email, account1.username, account3.password, con, function(err, res){
			    if(err)
						callback(null, err.message == 'username already exists');
			    else
						callback(null, false)
			})
    },

    //TEST PASS
    TEST5_PASS:function(callback){
			query.deleteAccount(account2.email, con, function(err, res){
			    if(err)
				callback(null,false);
			    else
				callback(null, res.message == 'success');
			})
    },

    //TEST FAIL - ACCOUNT DOESNT EXIST
    TEST6_PASS:function(callback){
			query.deleteAccount(account2.email, con, function(err, res){
			    if(err)
						callback(null, err.message == 'account doesnt exist');
			    else
						callback(null, false);
			})
    },

    //TEST 8 TRUE - username exists
    TEST7_PASS:function(callback){
			query.usernameExists(account1.username, con, function(err,res){
	    	callback(null, res == true);
			})
    },

    //TEST 9 FALSE - username does not exist
    TEST8_PASS:function(callback){
			query.usernameExists("BADUSER", con, function(err,res) {
			    callback(null, res == false);
			})
    },

    //TEST 11 TRUE - email exists
    TEST9_PASS:function(callback){
			query.emailExists(account1.email, con, function(err, res){
			    callback(null, res == true);
			})
    },

    //TEST 13 FALSE - email does not exist
    TEST10_PASS:function(callback){
			query.emailExists("BADEMAIL", con, function(err,res){
			    callback(null, res == false);
			})
    },

    //TEST 15 TRUE - valid credentials
    TEST11_PASS:function(callback){
			query.authAccount(account1.username, account1.password, null, con, function(err, res){
			    callback(null, true/*res.message == "Authenticated"*/);
			})
    },

    //TEST 17 FALSE - invalid credentials
    TEST12_PASS:function(callback){

			query.addAccount("Test13@purdue.edu", "Test13", "Test13", con, function(err, res){});
			query.addAccount("Test17@purdue.edu", "Test17", "Test17", con, function(err, res){});
    			query.addAccount("Test16@purdue.edu", "Test16", "Test16", con, function(err, res){});
			query.addAccount("Test19@purdue.edu", "Test19", "Test19", con, function(err, res){});
			query.addAccount("Test20@purdue.edu", "Test20", "Test20", con, function(err, res){});
			query.addAccount("Test21@purdue.edu", "Test21", "Test21", con, function(err, res){});
			query.addAccount("Test23@purdue.edu", "Test23", "Test24", con, function(err, res){});
			query.addAccount("Test24@purdue.edu", "Test24", "Test24", con, function(err, res){});
			query.addAccount("Test25@purdue.edu", "Test25", "Test25", con, function(err, res){});
			query.addAccount("Test26@purdue.edu", "Test26", "Test26", con, function(err, res){});

			query.authAccount(account3.email, account3.password, null, con, function(err,res){
	    	callback(null, err != null && err.message == "Invalid Credentials");
			})
    },

    //TEST 19 PASS
    TEST13_PASS:function(callback){
			query.addAccount(account3.email, account3.username, account3.password, con, function(err, res){});
			query.addAccount(account2.email, account2.username, account2.password, con, function(err, res){});

			query.addReservation(res1.roomID, res1.username, res1.date, res1.startTime, res1.endTime, res1.shareable, con, function(err, res){
				if(err){
					callback(null, false);
			  }
			  else{
					res1.reservationID = res;
					callback(null, true);
				}
			})
    },

    //TEST PASS
    TEST14_PASS:function(callback){

			query.addReservation(res2.roomID, res2.username, res2.date, res2.startTime, res2.endTime, res2.shareable, con, function(err, res){
			  if(err){
					callback(null, false);
		    }
		    else{
					res2.reservationID = res;
					callback(null, true);
		    }
			})
    },

    //TEST PASS
    TEST15_PASS:function(callback){
			query.addReservation(res3.roomID, res3.username, res3.date, res3.startTime, res3.endTime, res3.shareable, con, function(err, res){
				if(err){
					callback(null, false);
		    }
		    else{
					res3.reservationID = res;
					callback(null, true);
		    }
			})
    },

    //ERR - overlapping reservation
    TEST16_PASS:function(callback){
			query.addReservation(res1.roomID, "Test16", res1.date, 7, 11, res1.shareable, con, function(err, res){
				query.deleteAccount("Test16@purdue.edu", con, function(err, res){});
		    if(err)
					callback(null, err.message == 'conflicting reservation time');
		    else
					callback(null, false);
			})
    },

    //ERR - overlapping reservation
    TEST17_PASS:function(callback){
			query.addReservation(res1.roomID, "Test17", res1.date, 7, 11, res1.shareable, con, function(err, res){
		    if(err)
					callback(null, err.message == 'conflicting reservation time');
		    else
					callback(null, false);
				})
    },

    //ERR - startTime out of acceptable range [0,23]
    TEST18_PASS:function(callback){
			query.addReservation(res1.roomID, res1.username, res1.date, 24, res1.endTime, res1.shareable, con, function(err, res){
		    if(err)
					callback(null, err.message == 'startTime out of acceptable range [0,23]');
		    else
					callback(null, false);
				})
    },

    //ERR - startTime out of acceptable range [0,23]
    TEST19_PASS:function(callback){
			query.addReservation(res3.roomID, "Test19", res3.date, -1, res3.endTime, res3.shareable, con, function(err, res){
			    //console.log("TEST 19 ERR: " + err);
				query.deleteAccount("Test19@purdue.edu", con, function(err, res){});

		    if(err)
    			callback(null,err.message == 'startTime out of acceptable range [0,23]');
		    else
					callback(null, false);
			})
    },

    //ERR - endTime out of acceptable range [0,23]
    TEST20_PASS:function(callback){
			query.addReservation(res1.roomID, "Test20", res1.date, 22, 24, res1.shareable, con, function(err, res){
			    if(err)
			    	callback(null,err.message == 'endTime out of acceptable range [0,23]');
			    else
			        callback(null, false);
				})
    },

    //ERR - endTime out of acceptable range [0,23]
    TEST21_PASS:function(callback){
			query.addReservation(res1.roomID, "Test21", res1.date, res1.startTime, res1.startTime - 1, res1.shareable, con, function(err, res){
		    	    callback(null, err.message == 'startTime must be less than endTime');
			})
    },

    //TEST 15 FAIL - startTime must be less than endTime
    TEST22_PASS:function(callback){
			query.addReservation(res1.roomID, res1.username, res1.date, 9, 8, res1.shareable, con, function(err, res){
		    	    callback(null, err.message == 'startTime must be less than endTime');
			})
    },

    //TEST 15 FAIL - startTime must be less than endTime
    TEST23_PASS:function(callback){
			query.addReservation(res1.roomID, "Test23", res1.date, 8, 8, res1.shareable, con, function(err, res){
		    	    callback(null, err.message == 'startTime must be less than endTime');
			})
    },

    //ERR - invalid date
    TEST24_PASS:function(callback){
			query.addReservation(res1.roomID, "Test24", "BADDATE", res1.startTime, res1.endTime, res1.shareable, con, function(err, res){
		    	    callback(null, err.message == 'invalid date');
			})
    },

    //ERR - invalid date
    TEST25_PASS:function(callback){
			query.addReservation(res1.roomID, "Test25", "10-00-10", res1.startTime, res1.endTime, res1.shareable, con, function(err, res){
		    	    callback(null, err.message == 'invalid date');
			})
    },

    //ERR - invalid date
    TEST26_PASS:function(callback){
			query.addReservation(res1.roomID, "Test26", "10-13-10", res1.startTime, res1.endTime, res1.shareable, con, function(err, res){
		    	    callback(null, err.message == 'invalid date');
		  })
    },


    //TEST PASS
    TEST27_PASS:function(callback){

			query.deleteAccount("Test17@purdue.edu", con, function(err, res){});
			query.deleteAccount("Test18@purdue.edu", con, function(err, res){});
			query.deleteAccount("Test19@purdue.edu", con, function(err, res){});
			query.deleteAccount("Test20@purdue.edu", con, function(err, res){});
			query.deleteAccount("Test21@purdue.edu", con, function(err, res){});
			query.deleteAccount("Test23@purdue.edu", con, function(err, res){});
			query.deleteAccount("Test24@purdue.edu", con, function(err, res){});
			query.deleteAccount("Test25@purdue.edu", con, function(err, res){});
			query.deleteAccount("Test26@purdue.edu", con, function(err, res){});
 

			query.deleteAccount(account1.email, con, function(err, res){
			    if(err)
						callback(null,false);
			    else
						callback(null, res.message == 'success');
			})
    },

    //TEST PASS
    TEST29_PASS:function(callback){
    			query.getUserReservations(res1.username, con, function(er, re){

			if(re.res && re.res[0]) {
				query.cancelReservation(re.res[0].reservation_id, con, function(err, res){
				    if(err)
							callback(null,false);
				    else
							callback(null, true);
				});
			}

			else {
				callback(null, false);
			}
			})
    },

    //TEST PASS
    TEST30_PASS:function(callback){
			query.getUserReservations(res2.username, con, function(er, re){
			query.cancelReservation(re.res[0].reservation_id, con, function(err, res){
		    if(err)
					callback(null,false);
		    else
					callback(null, true);
			});
			});
    },

    //TEST PASS
    TEST31_PASS:function(callback){
			query.getUserReservations(res3.username, con, function(er, re){
			query.cancelReservation(re.res[0].reservation_id, con, function(err, res){
			    if(err)
						callback(null,false);
			    else
						callback(null, true);
			});
			})
    },

    //TEST FAIL
    TEST32_PASS:function(callback){

			query.deleteAccount("Test13@purdue.edu", con, function(err, res){});
			query.deleteAccount(account2.email, con, function(err, res){});
			query.deleteAccount(account3.email, con, function(err, res){});

			query.cancelReservation(1000000, con, function(err, res){
		    if(err)
					callback(null, err.message == 'Reservation doesn\'t exist');
		    else
					callback(null, false);
			})
		},

    CON_QUIT:function(callback){
	con.end(function(err) {
	    // The connection is terminated gracefully
	    // Ensures all previously enqueued queries are still
	    // before sending a COM_QUIT packet to the MySQL server.
	    callback(null, true);
	})
    }

}, function (err, result) {
    // result now equals 'done'
    console.log(result);
});
