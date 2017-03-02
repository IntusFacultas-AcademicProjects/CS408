//app.js, handles frontend functionality.
//BEFORE HOOKING UP WITH BACKEND
var app = angular.module("myApp", []);
//collective data controller
app.run(function(Session) {}); //bootstrap session;

app.factory('Session', function($http) {
  var Session = {
    data: {},
    saveSession: function(logIn, uName) { sessionStorage.data = {loggedIn: logIn, username: uName}; console.log(sessionStorage);},
    updateSession: function() { 
      /* load data from db */
      return data = sessionStorage.data;
      
    }
  };
  Session.updateSession();
  return Session; 
});

app.controller("user", ['$scope', '$http', function ($scope, $http, Session) {
	$scope.session = Session;
    $scope.config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
    $scope.userinfo = {
    					username: String,
    					password: String,
    					};
    $scope.login = function()
    {
    	
		$scope.userinfo.username = $scope.username;       
        $scope.userinfo.password = $scope.password;
		$http.post('/api/authAccount', $scope.userinfo).then(function(response) {
			if (typeof response.data.err == "undefined") {
				alert("Login successful");
				localStorage["firstPageLoad"] = false;
				$http.post('/api/retrieveUsername', $scope.email).then(function(response) {
					$scope.session.saveSession(true, response.username);
					window.location.href = '/reserve.html';	
				}
					
			}
			else {
				alert(response.data.err);
				window.location.reload();
			}  
			//load response
		});
    }

    $scope.recover = function()
    {
        console.log($scope.email);
    }
    $scope.register = function()
    {	
        if ($scope.password == $scope.confirmpassword)
        {
			$scope.userinfo.username = $scope.username;
			$scope.userinfo.email = $scope.email;
			$scope.userinfo.password = $scope.password;
			$http.post('/api/addAccount', $scope.userinfo).then(function(response) {
				if (typeof response.data.err == "undefined") {
					localStorage["firstPageLoad"] = false;				
					window.location.href = '/login.html';				 
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
    }

}]);


app.controller("index", function($scope) {
	
    $scope.user = {
        "username": String,
        "password": String,
        "userid": Number,
        "email": String,
        "budget": Number,
        "admin": Boolean
    };
    $scope.user.username = "Sfellers";
    $scope.user.password = "password";
    $scope.user.userid = 0;
    $scope.user.email = "sfellers@purdue.edu";
    $scope.user.budget = 3;
    $scope.user.admin = true;
    $scope.firstName = "Sam";
    $scope.lastName = "Fellers";
    $scope.roomsData = [];
    $scope.roomData = [];

    //functions go in here.
    $scope.addRoom = function(id, name, capacity) {
        var room = {
            "id": id,
            "name": name,
            "capacity": capacity
        };
        $scope.roomsData.push(room);
        $scope.roomData = "";

    };

});

app.controller("navbar", function($scope) {
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
});
app.controller("userPortal",['$scope', '$http', 'Session', function ($scope, $http, Session){
	$scope.session = Session;
    $scope.allowance = 0;
    $scope.reservations = [];
    $scope.cancel = function(id) {
    	console.log("Cancel: " + id);
    };
    $scope.fetchReservations = function() {
		//$http.post('/api/getUserReservations').then(function(response) {
			
	    //});
    };
}]);
app.controller("reservation", ['$scope', '$http', function ($scope, $http){
	$scope.date;
	$scope.adminDate;
	$scope.user = {
        "username": String,
        "password": String,
        "userid": Number,
        "email": String,
        "budget": Number,
        "admin": Boolean
    };
 	$scope.user.username = "Sfellers";
    $scope.user.password = "password";
    $scope.user.userid = 0;
    $scope.user.email = "sfellers@purdue.edu";
    $scope.user.budget = 3;
    $scope.user.admin = true;
    $scope.firstName = "Sam";
    $scope.lastName = "Fellers";
    var _slots = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];

    $scope._init = function() {
        $scope.slots = _slots;
        return true;
    }
    $scope._init();
    // fake variables for development time testing
    $scope.hours = [{
            id: 0,
            selected: "selected",
            name: "00:00 - 00:59"
        },
        {
            id: 1,
            selected: "",
            name: "01:00 - 01:59"
        },
        {
            id: 2,
            selected: "",
            name: "02:00 - 02:59"
        }

    ];
    $scope.isCollapsed = true;
    $scope.updateRooms = function() {
		var datePieces= $scope.date.split('/');
		var date = datePieces[2]+"-"+datePieces[0]+"-"+datePieces[1];
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
					                fillColor: 'ffffff'
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
    $scope.updateAdminRooms = function() {
		var datePieces= $scope.adminDate.split('/');
		var date = datePieces[2]+"-"+datePieces[0]+"-"+datePieces[1];
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
					                fillColor: 'ffffff'
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
    	//if(!localStorage["adminFirstPageLoad"]) {
			//localStorage["adminFirstPageLoad"] = true;
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
						                fillColor: 'ffffff'
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
		//}
    }
    $scope.loadRooms = function() {
    	//if(!localStorage["firstPageLoad"]) {
			//localStorage["firstpageLoad"] = true;
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
						                fillColor: 'ffffff'
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
    //}
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
    $scope.availableHours = [];

	$scope.refreshRoomsData = function(){
		$http.post('/api/getAllRooms', $scope.date).then(function(response) {

		});
	}

    // opens modal for viewing hours for a room
    $scope.openModal = function(event) {
        var id = event.target.id;
        var num = id.substring(4, id.length - 1);
        $scope.roomIndex = num;
        console.log(num);
        $scope.roomSelected = $scope.roomsData[$scope.roomIndex].roomName;
         if ($scope.roomsData[num].blocked)
        {
            $scope.roomStatus = "Current Status: Blocked";
            $scope.option = "Unblock";
        }
        else
        {
            $scope.roomStatus = "Current Status: Available";
            $scope.option = "Block";
        }
        if ($scope.roomsData[num].blocked == false && !$scope.user.admin) {
            $("#reserve-modal").modal("toggle");
            return true;
        } 
        else {
            var room = $scope.roomsData[num];
            console.log("attempting to open blocked room modal.")
            if ($scope.user.admin) {
                $("#reserve-block-modal").modal("toggle");
                return false;
            } 
            else {
                alert("This room is currently blocked");
                return false;
            }
        }
		
    };

    //handles mouseover for rooms on the map
    $scope.mouseOver = function(event) {
        var room = "#room" + event + "a";
        $(room).mapster('select');
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

    // permanently highlights rooms that are blocked (color change is not working)
    $scope.disableBlockedRooms = function() {
        angular.forEach($scope.roomsData, function(room, index) {
                if (room.blocked) {
                    var roomName = "#room" + room.roomid + "a";
                    var roomTable = "#room" + room.roomid + "c";
                    $(roomName).mapster('set', true);
                    $(roomName).css("background-color", 'black');
                    $('#map').mapster('set_options', {
                        areas: [{
                            key: room.roomid,
                            fillColor: '000000'
                        }]
                    });        
                }
            }

        );
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
    $scope.savechanges = function() {
        //get the reservation time
        $scope.start = document.getElementById("startTime").options[document.getElementById("startTime").selectedIndex].value;
        $scope.end = document.getElementById("endTime").options[document.getElementById("endTime").selectedIndex].value;
    	
        console.log($scope.start);
        console.log($scope.end);
    };
    // opens second reservation modal
    $scope.openHours = function(event, roomSelected) {
        $scope.availableHours = [];
        var hourTemplate = ["00:00-00:59", "01:00-01:59", "02:00-02:59", 
        					"03:00-03:59", "04:00-04:59", "05:00-05:59", 
        					"06:00-06:59", "07:00-07:59", "08:00-08:59", 
        					"09:00-09:59", "10:00-10:59", "11:00-11:59", 
        					"12:00-12:59", "13:00-13:59", "14:00-14:59", 
        					"15:00-15:59", "16:00-16:59", "17:00-17:59", 
        					"18:00-18:59", "19:00-19:59", "20:00-20:59", 
        					"21:00-21:59", "23:00-22:59", "23:00-23:59"];
        var startTime = event.target.id.substring(10, event.target.id.length);
        $scope.hourSelected = startTime;
        var room = roomSelected;
        console.log(roomSelected);
        var roomReservations = room.res;
        var takenHours = [];
        for (var i = 0; i < roomReservations.length; i++) {
            var reservationSlot = roomReservations[i];
            var start = reservationSlot.start;
            for (start; start <= reservationSlot.end; start++) {
                takenHours.push(start);
            }
        }
        var first = 0;
        for (var i = parseInt(startTime); takenHours.indexOf(i) < 0 && i < 24; i++) {
            if (first == 0) {
                $scope.availableHours.push({
                    id: i,
                    name: hourTemplate[i],
                    selected: "selected"
                });
                first++;
            } else {
                $scope.availableHours.push({
                    id: i,
                    name: hourTemplate[i],
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
    
    $scope.unblockRoom = function(id) {
    		//int id : roomId
    		if(id < 0 || id > 20){
        	return false;
        }
        if ($scope.roomsData[$scope.roomIndex].blocked) {
            $scope.roomsData[id].blocked = false;
            return true;
        }else{
          return false;
        }
    };
	
	$scope.blockRoom = function(id) {
  			//int id : roomId
    		if(id < 0 || id > 20){
        	return false;
        }
        if (!$scope.roomsData[$scope.roomIndex].blocked) {
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
            $scope.unblockRoom($scope.roomIndex);
            console.log($scope.roomsData[$scope.roomIndex].blocked)
            alert("Unblock successfully");
        }
        else
        {
            $scope.blockRoom($scope.roomIndex);
            console.log($scope.roomsData[$scope.roomIndex].blocked)
            alert("Block successfully");
        }
    };
    
    // used to block hours that are already reserved by someone else
    $scope.validate = function(roomData, hour) {
    	// roomData is temporarily undefined on page load
    	if (typeof roomData != 'undefined') {
    		var room = roomData.res;
		    for (var i = 0; i < room.length; i++) {
		        if (room[i].start <= hour && room[i].end >= hour){
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
		        if (room[i].start <= hour && room[i].end >= hour){
		            if (room[i].shareable == true) {
		                return true
		            }
		        }
		    }
		    return false;
    	}
    };
	
     $scope.toggleShareable = function(resId, roomId) {
     		//int resId : reservationId
    		if(roomId <= 0 || roomId >= 20){
        	return false;
        }
        if ($scope.checkBlocked(roomId)) {
            //cant toggle a blocked room
            return false;
        }
        $scope.reservationData.forEach(function(element){
        	if(element.reservationId == resId){
          	if(element.shareable){
            	element.shareable = false;
              return true;
            }else{
            	element.shareable = true;
              return true;
            }
          }
          return false;
        });
	return false;
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
            slots: '='
        },
        templateUrl: 'my-timetable-iso.html',
        link: function(scope, element, attributes) {
            var _days = ['Room 00', 'Room 01', 'Room 02', 'Room 03'];
            var _selection = {
                state: false,
                day: [0, 0, 0, 0],
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

                        for (i = 0; i < 4; i++) {
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


/*
 * POST HOOKING UP WITH BACKEND
var resApp = angular.module('resMod', []);
resApp.controller('resCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.firstName = "John";
 	$scope.lastName = "Doe";
	//functions go in here...
  	$scope.editRoom = function(id) {
		console.log("editting room id: " + id);
    	$http.get('/roomlist/' + id).success(function(response) {
    		$scope.roomsData = response;
  		});
  	};
}]);﻿
*/
