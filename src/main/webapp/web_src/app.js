//app.js, handles frontend functionality.
//BEFORE HOOKING UP WITH BACKEND
var app = angular.module("myApp", []);
//collective data controller
app.run(function(Session) {}); //bootstrap session;

app.factory('Session', function($http) {
  var Session = {
    data: {},
    saveSession: function(logIn, uName, adminPriv, adminTok, ver) {
	   	sessionStorage.setItem('data', JSON.stringify({loggedIn: logIn, username: uName, admin: adminPriv, adminToken: adminTok, verified: ver}));},
    updateSession: function() { 
      /* load data from db */
      return data = JSON.parse(sessionStorage.getItem('data'));      
    },
    closeSession: function() {
    	sessionStorage.setItem('data', JSON.stringify({loggedIn: false, username: "null" , admin: false, adminToken:"null", verified: true}));
    }
  };
  Session.updateSession();
  return Session; 
});
app.controller("verify", ['$scope', '$http', 'Session', function($scope, $http, Session) {
	$scope.session = Session;
	$scope.sessionData = $scope.session.updateSession();
	$scope.pin;
	$scope.confirmSession = function() {
		if (typeof $scope.sessionData == "undefined" ) {
     		$scope.sessionData = $scope.session.updateSession();
     		while(typeof $scope.sessionData == "undefined") {
     		
     		}
     	}
		if ($scope.sessionData === null) {
    		alert("what");
    	}
        else {
            if ($scope.sessionData.verified && $scope.sessionData.loggedIn) {
                window.location.href = '/reserve.html';
            }
            else if ($scope.sessionData.verified && !$scope.sessionData.loggedIn) {
            	window.location.href='/login.html';
            }   
        }
	}
	$scope.submit = function() {
		$http.post("/api/authorizePin",{"username":$scope.sessionData.username, "pin": $scope.pin}).then(function(response){
			if (typeof response.data.err == "undefined") {
				$scope.session.saveSession(false, $scope.sessionData.username, $scope.sessionData.password,false, "null", 1);
				alert("Verification successful! Please log in to continue!");
				window.location.href='video.html';
			}
			else {
				alert(response.data.err);
				window.location.reload();
			}
		});
		console.log($scope.pin);
	}
}]);
app.controller("user", ['$scope', '$http', 'Session', function ($scope, $http, Session) {
	$scope.session = Session;
	$scope.sessionData = $scope.session.updateSession();
	if (localStorage.getItem("saveFlag") != null && JSON.parse(localStorage.getItem('saveFlag')).save) {
		$scope.save = true;
	}
	else {
		$scope.save = false;
	}
	
    $scope.config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
    $scope.userinfo = {
    					username: String,
    					password: String
    					};
    $scope.confirmLogin = function() {
    	if ($scope.sessionData === null) {
    		
    	}
        else {

            if ($scope.sessionData.loggedIn) {
                window.location.href = '/reserve.html';
                return;
            }    
        }
    	if (localStorage.getItem("saveFlag") != null && JSON.parse(localStorage.getItem('saveFlag')).save) {
    		var data = JSON.parse(localStorage.getItem('login'));
			$("#remember").prop('checked', true);
			/* BUG #13
			 * Old Code : $("#usernameDiv").addClass("is-focused");
			 *			  $("#passwordDiv").addClass("is-focused");
			 * New Code : N/A
			 */
    		$scope.username = data.username;
    		$scope.password = data.password;
    	}
    }
    $scope.login = function()
    {
		if ($scope.save) {
			localStorage.setItem('login', JSON.stringify({username: $scope.username, password: $scope.password}));
			localStorage.setItem('saveFlag', JSON.stringify({save: true}));
		}
		else if ($scope.save == false) {
			localStorage.setItem('login', JSON.stringify({username: "", password: ""}));
			localStorage.setItem('saveFlag', JSON.stringify({save: false}));
		}
		$scope.userinfo.username = $scope.username;       
        $scope.userinfo.password = $scope.password;
    	
		if ($scope.username.indexOf('%') >= 0 || $scope.password.indexOf('%') >= 0){
		 					alert("Invalid Credentials");
            				window.location.reload();
		 					return;
		 }
		$http.post('/api/authAccount', $scope.userinfo).then(function(response) {
			
			if (typeof response.data.err == "undefined") {
				localStorage["firstPageLoad"] = false;				
				$scope.session.saveSession(true, $scope.username, response.data.data, response.data.adminTok, response.data.ver);
				
				window.location.href = '/reserve.html';									
			}
			else {
				alert(response.data.err);
				window.location.reload();
			}  
			//load response
		});
    }
	$scope.remember = function() {
		$scope.save = $('#remember').is(":checked");
	}
    $scope.recover = function()
    {
        $http.post('/api/recoverPassword', {"email":$scope.emailRecovery}).then(function(response) {
            if (typeof response.data.err == "undefined") {
                alert("Your password has been sent to the email associatd with this account");
                window.location.href = '/login.html';
            }
            else {
                alert(response.data.err);
                window.location.reload();
            }
        });
    }
    $scope.register = function()
    {	
		if(!$scope.email.match(/^\w+([\.-]?\w+)*@purdue.edu$/)){
			alert("Invalid Email");
		}
        if ($scope.password == $scope.confirmpassword)
        {
			$scope.userinfo.username = $scope.username;
			$scope.userinfo.email = $scope.email;
			$scope.userinfo.password = $scope.password;
			$http.post('/api/addAccount', $scope.userinfo).then(function(response) {
				if (typeof response.data.err == "undefined") {
					localStorage["firstPageLoad"] = false;
					$scope.session.saveSession(false, $scope.username, "null", "null", 0);
					alert("Account creation successful!\n Please check your email for the verification pin and enter it in the next step.\n You won't be able to use RSVP until you do so!");				
					window.location.href = '/pin.html';				 
				}
				else {
					alert(response.data.err);
					window.location.reload();
				}  
			    //load response
			    });
        }
        else {
        	alert("Passwords must match");
        }
    };

}]);

app.controller("navbar", ['$scope', '$http', 'Session', function ($scope, $http, Session)  {
	$scope.session = Session;
	
	$scope.sessionData = $scope.session.updateSession();
	$scope.boolVal = true;
	$scope.check = function() {
		return true;
	}
	$scope.notLogged = function() {
		if ($scope.sessionData == null) {
			return true;
		}
		if ($scope.sessionData.loggedIn) {
		
			return false;
		}
		
		return true;
	}
	$scope.logged = function() {
		if ($scope.sessionData == null) {
			return false;
		}
		
		if ($scope.sessionData.loggedIn) {
			if ($scope.sessionData.admin == false) {
		
				return true;
			}
		
			return false;		
		}
		
		return false;
	}
	$scope.adminLog = function() {
		if ($scope.sessionData == null) {
			return false;
		}
		if ($scope.sessionData.loggedIn && $scope.sessionData.admin) {
		
			return true;
		}
		
		return false;
	}
	$scope.logout = function() {
		$scope.session.closeSession();
		$scope.sessionData = $scope.session.updateSession();
		
		//window.location.reload();
		window.location.href = "/login.html";
	}
	$scope.login = function() {
		localStorage["firstPageLoad"] = false;
		localStorage["adminFirstPageLoad"] = false;
		window.location.href = "/login.html";
	}
	$scope.register = function() {
		localStorage["firstPageLoad"] = false;
		localStorage["adminFirstPageLoad"] = false;
		window.location.href = "/register.html";
	}
	$scope.admin = function() {
		localStorage["firstPageLoad"] = false;
		localStorage["adminFirstPageLoad"] = false;
		window.location.href = "/admin.html";
	}
    $scope.portal = function() {
        localStorage["firstPageLoad"] = false;
		localStorage["adminFirstPageLoad"] = false;
		window.location.href = "/account-portal.html";
    }
}]);
app.controller("userPortal",['$scope', '$http', 'Session', function ($scope, $http, Session){
	$scope.session = Session;
	$scope.sessionData = $scope.session.updateSession();
    $scope.allowance = 0;
    $scope.reservations = [];
    $scope.confirmPassword;
    $scope.oldPassword;
    $scope.newPassword;
    $scope.numRes = 0;
    $scope.cancel = function(event) {
    	
    	$http.post('/api/cancelReservation', {reservationID: $scope.reservations[parseInt(event.target.id)].reservation_id}).then(function(response) {
    		location.reload();
    	});
    };
     $scope.confirmLogin = function() {
     	if ($scope.sessionData === null) {
    		alert("Session has expired.");
    		window.location.href= '/login.html';
    		return;
    	}
    	if (!$scope.sessionData.verified) {
        		window.location.href = '/pin.html';
        		return
        	}
    	if (!$scope.sessionData.loggedIn) {
    		window.location.href = '/login.html';
    		return;	
    	}
    	else {
    		$scope.fetchReservations();
    	}
    }
    $scope.changePassword = function() {
    	if ($scope.newPassword == $scope.confirmPassword) {
			$http.post('/api/updateAccountPassword', {username:$scope.sessionData.username, oldPassword: $scope.oldPassword, newPassword: $scope.newPassword}).then(function(response) {
				if (typeof response.data.err == "undefined") {
					alert("Password has been changed");
				}
				else {
					alert("Password not changed.\n" + response.data.err);
				}
				window.location.reload();
			});
    	}
    	else {
    		alert("Passwords must match.");
    	}
    	
    }
    $scope.share = function(event) {
    	$http.post('/api/setReservationShareable', {reservationID: $scope.reservations[parseInt(event.target.id.substring(7, event.target.id.length))].reservation_id, status:$(event.target).is(":checked")}).then(function(response) {
    		if (typeof response.data.err == "undefined") {
    		
    		}
    		else {
    			alert("An error has occurred. Please contact the System Administrator\n" + response.data.err);
				$scope.status = "error : shareable";
    		}
    	});
    };
    $scope.fetchReservations = function() {
    	
		$http.post('/api/getUserReservations', {username:$scope.sessionData.username}).then(function(response) {
			$scope.reservations = response.data.res;
			var start = ["00:00", "01:00", "02:00", 
        					"03:00", "04:00", "05:00", 
        					"06:00", "07:00", "08:00", 
        					"09:00", "10:00", "11:00", 
        					"12:00", "13:00", "14:00", 
        					"15:00", "16:00", "17:00", 
        					"18:00", "19:00", "20:00", 
        					"21:00", "23:00", "23:00"];
        	var end = ["ERROR","00:59", "01:59", "02:59", 
        					"03:59", "04:59", "05:59", 
        					"06:59", "07:59", "08:59", 
        					"09:59", "10:59", "11:59", 
        					"12:59", "13:59", "14:59", 
        					"15:59", "16:59", "17:59", 
        					"18:59", "19:59", "20:59", 
        					"21:59", "22:59", "23:59"];
        	var months = ["ERROR", "January", "February", "March", "April", "May","June", "July", "August", "September", "October", "November", "December"];
        	angular.forEach($scope.reservations, function(reservation, index) {
					    reservation.date=reservation.date.substring(0, reservation.date.indexOf("T"));
					    var date = reservation.date.split("-");
					    reservation.date = months[parseInt(date[1])] + " " + date[2] + " " + date[0];
					    reservation.startTime = start[reservation.startTime];
						reservation.endTime = end[reservation.endTime];
						if (reservation.blockedStatus == 0) {
							$scope.numRes += 1;
						}
					}

				);
	    });
	    
	    $http.post('/api/getUserHours', {username: $scope.sessionData.username}).then(function(response) {
	    	$scope.allowance = response.data.data;
	    });
    };
    
}]);

app.controller('administration', ['$scope', '$http', 'Session', function ($scope, $http, Session) {
    $scope.session = Session;
    $scope.sessionData = $scope.session.updateSession();
	$scope.date;
	$scope.adminDate;
   
     // json information delivered from SQL database (currently disposable data)
    $scope.roomsData = [];
    // name displayed at top of modal
    $scope.roomSelected;
    // index of room data in array
    $scope.roomIndex;
    // hour selected from reserve-modal serves as start time
    $scope.hourSelected;
    // available hours from selected start time
    //status text
    $scope.roomStatus;
    //admin option
    $scope.option;
    // start date of blocking
    $scope.dpbStart;
    // end date of blocking
    $scope.dpbEnd;
    // preview table data
    $scope.previewData = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    $scope.previewRoom;
    $scope.availableHours = [];

    $scope.confirmLogin = function() {
    	if ($scope.sessionData === null) {
    		alert("Session has expired.");
    		window.location.href= '/login.html';
    		return;
    	}
    	if (!$scope.sessionData.verified) {
    		window.location.href = '/pin.html';
    		return;
    	}
    	if (!$scope.sessionData.loggedIn) {
    		window.location.href = '/login.html';
    		return;	
    	}
    	else if (!$scope.sessionData.admin && $scope.sessionData.loggedIn) {
    		window.location.href = '/reserve.html';
    		return;
    	}
    	else {
    		$scope.adminLoadRooms();
    	}
    }
    $scope.updateAdminRooms = function() {
		var datePieces= $scope.adminDate.split('/');
		var date = datePieces[2]+"-"+datePieces[0]+"-"+datePieces[1];
		if(datePieces[2] < 2017){
			alert("invalid year requested");
			return;
		}
		$http.post('/api/getAllRooms', {date:date}).then(function(response) {
			if (typeof response.data.err == "undefined") {
				$scope.roomsData = response.data.rooms;
				angular.forEach($scope.roomsData, function(room, index) {
					    if (room.blocked) {
					        var roomName = "#room" + room.roomid + "a";
					        var roomTable = "#room" + room.roomid + "c";
					        $(roomName).mapster('set', true);
					        $(roomName).css("background-color", 'black');
					        $('#map').mapster('set_options', {
					            areas: [{
					                key: room.roomid,
                                	listKey: room.roomid,
					                fillColor: 'ffffff',
                                	showToolTip: true
                            }]});
                           	map.mapster('set_options', { 
						    areas: [{
						        room: room.roomid,
						        toolTip: "Test"
						        }]
						    });
					    }
					}

				);
				return true;		 
			}
			else {
				alert(response.data.err);
				window.location.reload();
			}  
		    //load response
	    });
    };
    $scope.adminLoadRooms = function() {
    
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1;
			var yyyy = today.getFullYear();

			if(dd<10) {
				dd='0'+dd;
			} 

			if(mm<10) {
				mm='0'+mm;
			} 

			today = yyyy+ '-'+mm+'-'+dd;
			$http.post('/api/getAllRooms', {date:today}).then(function(response) {
				if (typeof response.data.err == "undefined") {
					$scope.roomsData = response.data.rooms;
					angular.forEach($scope.roomsData, function(room, index) {
						    if (room.blocked) {
						        var roomName = "#room" + room.roomid + "a";
						        var roomTable = "#room" + room.roomid + "c";
						        $(roomName).mapster('set', true);
						        $(roomName).css("background-color", 'black');
						         $('#map').mapster('set_options', {
					            areas: [{
					                key: room.roomid,
                                	listKey: room.roomid,
					                fillColor: 'ffffff',
                                	showToolTip: true
                            }]});
                           	map.mapster('set_options', { 
						    areas: [{
						        room: room.roomid,
						        toolTip: "Test"
						        }]
						    });
						    }
						}

					);
					return true;		 
				}
				else {
					alert(response.data.err);
					window.location.reload();
				}  
			    //load response
		    });
    }
    $scope.unblockRoom = function(id) {
    	//int id : roomId
    	/* BUG #8
		 * Old Code : if(id < 0 || id > 20)
		 * New Code : if(id <= 0 || id > 20)
		 */
    	if(id <= 0 || id > 20){
        	return false;
        }
        if ($scope.roomsData[$scope.roomIndex].blocked) {
        	$http.post('/api/setRoomBlockedStatus', {roomID: $scope.roomsData[id].roomid, status: false, adminTok:$scope.sessionData.adminToken}).then(function(response) {
        		alert(response.data);
        		if (typeof response.data.err == "undefined") {
        		}
        		else {
        			alert("An error has occurred \n Contact the System Administrator");
        		}
        	});
            $scope.roomsData[id].blocked = false;
            return true;
        }else{
          return false;
        }
    };
	
	$scope.blockRoom = function(id) {
  		//int id : roomId
		/* BUG #7
		 * Old Code : if(id < 0 || id > 20)
		 * New Code : if(id < 0 || id > 17)
		 */
    	if(id < 0 || id > 17){
        	return false;
        }
        if (!$scope.roomsData[$scope.roomIndex].blocked) {
        	$http.post('/api/setRoomBlockedStatus', {roomID: $scope.roomsData[id].roomid, status: true, adminTok:$scope.sessionData.adminToken}).then(function(response) {
        		alert(response.data);
        		
        		if (typeof response.data.err == "undefined") {
        		}
        		else {
        			alert("An error has occurred \n Contact the System Administrator");
        		}
        	});
            $scope.roomsData[id].blocked = true;
            return true;
        }else{
          return false;
        }
    };
    //admin block options
   	$scope.adminoption = function() {

        if ($scope.roomsData[$scope.roomIndex].blocked)
        {
            var val = $scope.unblockRoom($scope.roomIndex);
            
            alert("Unblocked successfully");
            window.location.reload();
			return true;
        }
        else
        {
            $scope.blockRoom($scope.roomIndex);
            
            alert("Blocked successfully");
            window.location.reload();
			return true;
        }
    };
	$scope.loadPreview =  function(num) {
    	var roomReservations = $scope.roomsData[num].res;
        var takenHours = [];
        var roomHours = [];
        for (var i = 0; i < roomReservations.length; i++) {
            var reservationSlot = roomReservations[i];
            var start = reservationSlot.startTime;
            for (start; start < reservationSlot.endTime; start++) {
                takenHours.push(start);
            }
        }
        for (var i = 0; i < 24; i ++) {
        	if (takenHours.indexOf(i) >= 0) {
        		roomHours.push(1);
        	}
        	else {
        		roomHours.push(0);
        	}
        }
        $scope.previewData = roomHours;
        $scope.previewRoom = $scope.roomsData[num].roomName;
    }
    $scope.openAdminModal = function(event) {
        var id = event.target.id;
        var num = id.substring(4, id.length - 1);
        $scope.roomIndex = num;
        $scope.roomSelected = $scope.roomsData[$scope.roomIndex].roomName;
         if ($scope.roomsData[num].blocked)
        {
            $scope.roomStatus = "Current Status: Blocked";
			/* BUG #5
			 * Old Code : $scope.option = "Unblock";
			 * New Code : $scope.option = "Block";
			 */
            $scope.option = "Block";
        }
        else
        {
            $scope.roomStatus = "Current Status: Available";
            $scope.option = "Block";
        }
        var room = $scope.roomsData[num];
		$("#reserve-block-modal").modal("toggle");
		return false;

    };

}]);

app.controller("reservation", ['$scope', '$http', 'Session', function ($scope, $http, Session){
	$scope.session = Session;
	$scope.sessionData = $scope.session.updateSession();
	$scope.date;
    // json information delivered from SQL database 
    $scope.roomsData = [];
    // name displayed at top of modal
    $scope.roomSelected;
    // index of room data in array
    $scope.roomIndex;
    // hour selected from reserve-modal serves as start time
    $scope.hourSelected;
    // available hours from selected start time
    //status text
    $scope.roomStatus;
    //admin option
    $scope.option;
    // preview table data
    $scope.previewData = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    $scope.previewRoom;
    $scope.availableHours = [];
    $scope.availableHoursEnd = [];
	
    $scope.confirmLogin = function() {
    	if ($scope.sessionData === null) {
    		alert("Session has expired.");
    		window.location.href= '/login.html';
            return;
    	}
    	if (!$scope.sessionData.verified) {
    		window.location.href = '/pin.html';
    		return;
    	}
    	if (!$scope.sessionData.loggedIn) {
    		window.location.href = '/login.html';
    		return;	
    	}
    }
    
//    Bound to datepicker, serves as onchange function and loads new room information
    $scope.updateRooms = function() {
		//var datePieces= $scope.date.split('/');
		//var date = datePieces[2]+"-"+datePieces[0]+"-"+datePieces[1];
		var date = $scope.parseDate();
		if(date == -1){
			alert("invalid date supplied.");
			return false;
		}
		$http.post('/api/getAllRooms', {date:date}).then(function(response) {
			if (typeof response.data.err == "undefined") {
				$scope.roomsData = response.data.rooms;
				
				angular.forEach($scope.roomsData, function(room, index) {
					    if (room.blocked) {
					        var roomName = "#room" + room.roomid + "a";
					        var roomTable = "#room" + room.roomid + "c";
					        $(roomName).mapster('set', true);
					        $(roomName).css("background-color", 'black');
					        $('#map').mapster('set_options', {
					            areas: [{
					                key: room.roomid,
                                	listKey: room.roomid,
					                fillColor: 'ffffff',
                                	showToolTip: true
                            }]});
                           	map.mapster('set_options', { 
						    areas: [{
						        room: room.roomid,
						        toolTip: "Test"
						        }]
						    });
					    }
					}

				);
				return true;		 
			}
			else {
				alert(response.data.err);
				window.location.reload();
			}  
		    //load response
	    });
    };
   
//    Bound to datepicker, serves as init function and loads room information on page load for the current date
    $scope.loadRooms = function() {
			var today = $scope.getToday();
			$http.post('/api/getAllRooms', {date:today}).then(function(response) {
				if (typeof response.data.err == "undefined") {
					$scope.roomsData = response.data.rooms;
					angular.forEach($scope.roomsData, function(room, index) {
						    if (room.blocked) {
						        var roomName = "#room" + room.roomid + "a";
						        var roomTable = "#room" + room.roomid + "c";
						        $(roomName).mapster('set', true);
						         $('#map').mapster('set_options', {
					            areas: [{
					                key: room.roomid,
                                	listKey: room.roomid,
					                fillColor: 'ffffff',
                                	showToolTip: true
                            }]});
                           	map.mapster('set_options', { 
						    areas: [{
						        room: room.roomid,
						        toolTip: "Test"
						        }]
						    });
						    }
						}

					);
					return true;		 
				}
				else {
					alert(response.data.err);
					window.location.reload();
				}  
			    //load response
		    });
		};

	$scope.getToday = function(){
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1;
		var yyyy = today.getFullYear();

		if(dd<10) {	dd='0'+dd;	} 
		if(mm<10) { mm='0'+mm;	} 
		today = yyyy + '-' + mm + '-' + dd;

		return today;
	};

	$scope.parseDate = function(){
		if($scope.date == undefined){
        	return -1;
        }
		var datePieces= $scope.date.split('/');
        if(datePieces.length != 3){
            return -1;
        }
		var date = datePieces[2]+"-"+datePieces[0]+"-"+datePieces[1];
		return date;
	};
	$scope.refreshRoomsData = function(){
		$http.post('/api/getAllRooms', $scope.date).then(function(response) {

		});
	}
	 $scope.loadPreview =  function(num) {
    	var roomReservations = $scope.roomsData[num].res;
        var takenHours = [];
        var roomHours = [];
        for (var i = 0; i < roomReservations.length; i++) {
            var reservationSlot = roomReservations[i];
            var start = reservationSlot.startTime;
            for (start; start < reservationSlot.endTime; start++) {
                takenHours.push(start);
            }
        }
        for (var i = 0; i < 24; i ++) {
        	if (takenHours.indexOf(i) >= 0) {
        		roomHours.push(1);
        	}
        	else {
        		roomHours.push(0);
        	}
        }
        $scope.previewData = roomHours;
        $scope.previewRoom = $scope.roomsData[num].roomName;
    }
    // opens modal for viewing hours for a room
    $scope.openModal = function(event) {
    	$("#roomModal.0").prop("disabled", true);
    	 var id = event.target.id;
        var num = id.substring(4, id.length - 1);
        $scope.roomIndex = num;
        $scope.roomSelected = $scope.roomsData[$scope.roomIndex].roomName;
    
        if ($scope.roomsData[num].blocked == false) {
        	
            $("#reserve-modal").modal("toggle");
        } 
        else {
            var room = $scope.roomsData[num];
            
            if ($scope.user.admin) {
                $("#reserve-block-modal").modal("toggle");
            } 
            else {
                alert("This room is currently blocked");
            }
        }
    }
   
    //handles mouseover for rooms on the map
    $scope.mouseOver = function(event) {
        var room = "#room" + event + "a";
        $(room).mapster('select');
        $(room).attr('title', 'This is the hover-over text');
        return true;
    };

    // handles mouseover for rooms on the map
    $scope.mouseLeave = function(event) {
        var room = "#room" + event + "a";
        if ($scope.roomsData[event].blocked == false) {
            $(room).mapster('deselect');
        }
        return true;
    };


    // checks blocked status
    $scope.checkBlocked = function(id) {
    	if (typeof $scope.roomsData == "undefined") {
    		if(id <= 0 || id >= 20){
		    	return false;
		    }
		    if ($scope.roomsData[id].blocked) {
		        //var name = "#room" + id;
		        return true;
		    }
		    else{
		   		return false;
		    }
    	}
    };
    
//    submit on second hours modal
    $scope.savechanges = function(room) {
        //get the reservation time
        var start = document.getElementById("startTime").options[document.getElementById("startTime").selectedIndex].value;
        var end = document.getElementById("endTime").options[document.getElementById("endTime").selectedIndex].value;

        start = parseInt(start);
        end = parseInt(end);
        var dateChosen = $("#dp").val();
        var dateA = dateChosen.split("/");
        dateChosen = dateA[2] + "-"+ dateA[0] + "-" + dateA[1];
    	var share = document.getElementById("shareOption").checked;
    	if (share) {
    		share = 1;
    	}
    	else {
    		share = 0;
    	}
        $scope.sessionData = $scope.session.updateSession();

 
        $http.post('/api/addReservation', {roomID: room.roomid, username: $scope.sessionData.username, date:dateChosen, startTime: start, endTime: end, shareable:share}).then(function(response) {
        	if (typeof response.data.err == "undefined") {
        	}
        	else {
        		alert(response.data.err);
        	}
        	window.location.reload();
        });
        
    };
    
    // opens second reservation modal
    $scope.openHours = function(event, roomSelected) {
        $scope.availableHours = [];
        $scope.availableHoursEnd = [];
        var hourTemplateStart = ["00:00", "01:00", "02:00", 
        					"03:00", "04:00", "05:00", 
        					"06:00", "07:00", "08:00", 
        					"09:00", "10:00", "11:00", 
        					"12:00", "13:00", "14:00", 
        					"15:00", "16:00", "17:00", 
        					"18:00", "19:00", "20:00", 
        					"21:00", "22:00", "23:00"];
        var hourTemplateEnd = ["00:59", "01:59", "02:59", 
        					"03:59", "04:59", "05:59", 
        					"06:59", "07:59", "08:59", 
        					"09:59", "10:59", "11:59", 
        					"12:59", "13:59", "14:59", 
        					"15:59", "16:59", "17:59", 
        					"18:59", "19:59", "20:59", 
        					"21:59", "22:59", "23:59"];
        var startTime = event.target.id.substring(10, event.target.id.length);
        $scope.hourSelected = startTime;
        var room = roomSelected;
        var roomReservations = room.res;
        var takenHours = [];
        for (var i = 0; i < roomReservations.length; i++) {
            var reservationSlot = roomReservations[i];
            var start = reservationSlot.startTime;
            for (start; start < reservationSlot.endTime; start++) {
                takenHours.push(start);
            }
        }
        var first = 0;
        for (var i = parseInt(startTime); takenHours.indexOf(i) < 0 && i < 24; i++) {
            if (first == 0) {
                $scope.availableHours.push({
                    id: i,
                    name: hourTemplateStart[i],
                    selected: "selected"
                });
                first++;
            } else {
                $scope.availableHours.push({
                    id: i,
                    name: hourTemplateStart[i],
                    selected: ""
                });
            }
        }
        for (var i = parseInt(startTime); takenHours.indexOf(i) < 0 && i < 24; i++) {
            if (first == 0) {
                $scope.availableHoursEnd.push({
                    id: i+1,
                    name: hourTemplateEnd[i],
                    selected: "selected"
                });
                first++;
            } else {
                $scope.availableHoursEnd.push({
                    id: i+1,
                    name: hourTemplateEnd[i],
                    selected: ""
                });
            }
        }
        $("#reserve-input-modal").modal("toggle");
        return true;
    }
    
    // closes second modal. overrides normal modal close to avoid double closure
    $scope.closeSecondModal = function() {
        $("#reserve-input-modal").modal("toggle");
        return true;
    }
    
    // used to block hours that are already reserved by someone else
    $scope.validate = function(roomData, hour) {
    	// roomData is temporarily undefined on page load
    	if (typeof roomData != 'undefined') {
    		var room = roomData.res;
		    for (var i = 0; i < room.length; i++) {
		        if (room[i].startTime <= hour && room[i].endTime > hour){
		            return true;
		        }
		    }
		    return false;
    	}
    };
	
	// used to color hours as shareable if hours are shareable (DOM not updating)
    $scope.validateShareable = function(roomData, hour) {
    	// roomData is temporarily undefined on page load
    	if (typeof roomData != 'undefined') {
    		var room = roomData.res;
    		
		    for (var i = 0; i < room.length; i++) {
		    	
		        if (room[i].startTime <= hour && room[i].endTime > hour){
		            if (room[i].shareable == 1) {
		            	
		                return true
		            }
		        }
		    }
		    
		    return false;
    	}
    };
}]).directive('reservationTable', function($timeout) {
    // handles the hour by hour modal body for the modal opened on map click
    return {
        restrict: 'E',
        scope: {
            roomData: '=info',
            roomIndex: '=index'
        },
        templateUrl: 'reservation-table.html',
        compile: function(tElem, attrs) {
            $timeout(function() {return {
                pre: function(scope, iElem, iAttrs) {
                    //access this data 
                    iElem.children().each(function() {
                        $(this).children().each(function() {
                        })
                    })

                }, // pre
                post: function(scope, iElem, iAttrs) {
                    $.material.init();
                } // post
            }}) //return
        } // compile
    }; // return
});


// this is the directive for the tabular view to the right of the map
app.directive('timetable', function() {
    return {
        restrict: 'AE',
        scope: {
            slots: '=',
            room: '='
        },
        templateUrl: 'my-timetable-iso.html',
        link: function(scope, element, attributes) {
            var _days = ['Room 00'];
            var _selection = {
                state: false,
                day: [0],
                hour: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            };

            function _loop(begin, end, step) {
                var array = [];

                for (var i = begin; i <= end; i += step) {
                    array.push(i);
                }

                return array;
            }

            function _toggle(what, day, hour) {
                var i = 0;
                switch (what) {
                    case 'day':
                        _selection.day[day] = !_selection.day[day];

                        for (i = 0; i < 24; i++) {
                            scope.slots[day][i] = _selection.day[day];
                        }
                        break;

                    case 'hour':
                        _selection.hour[hour] = !_selection.hour[hour];

                        for (i = 0; i < 1; i++) {
                            scope.slots[i][hour] = _selection.hour[hour];
                        }
                        break;

                    case 'slot':
                        if (_selection.state) {
                            scope.slots[day][hour] = !scope.slots[day][hour];
                        }
                        break;
                }
            }

            function _select(state, day, hour) {
                _selection.state = state;

                if (_selection.state) {
                    _toggle('slot', day, hour);
                }
            }

            function _init() {
                scope.loop = _loop;
                scope.toggle = _toggle;
                scope.select = _select;

                scope.days = _days;
            }

            _init();
        }
    };
});


