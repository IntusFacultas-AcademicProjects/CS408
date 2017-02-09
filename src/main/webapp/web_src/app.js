//app.js, handles frontend functionality.


//BEFORE HOOKING UP WITH BACKEND
var app = angular.module("myApp", []);

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
 	$scope.roomsData  = [];


	//functions go in here.
  	$scope.addRoom = function(id, name, capacity) {
		var room = 
		{
			"id":id,
			"name":name,
			"capacity":capacity
		};
		$scope.roomsData.push(room);
		$scope.roomData = "";
	
  	};

});

app.controller("navbar", function($scope) {
    
});

app.controller("reservation", function($scope) {

   $scope.naomi = { name: 'Naomi', address: '1600 Amphitheatre' };
   $scope.igor = { name: 'Igor', address: '123 Somewhere' };

	$scope.user = { 
		"username": String,
		"password": String,
		"userid": Number,
		"email": String,
		"budget": Number,
		"admin": Boolean
	};

    $scope.user.username = "SFellers";
    $scope.user.password = "password";
	$scope.user.userid = 0;
	$scope.user.email = "sfellers@purdue.edu";
	$scope.user.budget = 3;
	$scope.user.admin = true;

     var _slots = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ];
      function _init() {
        $scope.slots = _slots;
        $scope.roomData = [1,2,4];
      }
    
    // variables
    $scope.hours = [ 
        {
            id:0,
            selected: "selected",
            name: "00:00 - 00:59"
        },
        {
            id:1,
            selected: "",
            name: "01:00 - 01:59"
        },
        {
            id:2,
            selected: "",
            name: "02:00 - 02:59"
        }

    ];
    $scope.isCollapsed = true;
    $scope.roomData = [1,2,4];
    $scope.roomsData  = [
        {
            blocked:true,
            res: {},
            day: 1,
            roomid:1
        },
        {
            blocked:false,
            res: [
                {
                    user:"Pedro",
                    start: 0,
                    end: 4,
                    shareable: false
                },
                {
                    user:"Andrew",
                    start: 7,
                    end: 8,
                    shareable: true
                }
            ],
            day: 1,
            roomid:2
        },
        {
            blocked:true,
            res: [],
            day: 1,
            roomid:3
        },
        {
            blocked:false,
            res: [],
            day: 1,
            roomid:4
        },
        {
            blocked:false,
            res: [],
            day: 1,
            roomid:5
        },
        {
            blocked:false,
            res: [],
            day: 1,
            roomid:6
        },
        {
            blocked:false,
            res: [],
            day: 1,
            roomid:7
        },
        {
            blocked:false,
            res: [],
            day: 1,
            roomid:8
        },
        {
            blocked:false,
            res: [],
            day: 1,
            roomid:9
        },
        {
            blocked:false,
            res: [],
            day: 1,
            roomid:10
        },
        {
            blocked:false,
            res: [],
            day: 1,
            roomid:11
        },
        {
            blocked:false,
            res: [],
            day: 1,
            roomid:12
        },
        {
            blocked:false,
            res: [],
            day: 1,
            roomid:13
        },
        {
            blocked:false,
            res: [],
            day: 1,
            roomid:14
        },
        {
            blocked:false,
            res: [],
            day: 1,
            roomid:15
        },
        {
            blocked:false,
            res: [],
            day: 1,
            roomid:16
        },
        {
            blocked:false,
            res: [],
            day: 1,
            roomid:17
        },
        {
            blocked:false,
            res: [],
            day: 1,
            roomid:18
        },
        {
            blocked:false,
            res: [],
            day: 1,
            roomid:19
        }
    ];
    $scope.roomSelected;
    $scope.roomIndex;
    var _slots = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ];
    function _init() {
        $scope.slots = _slots;
        $scope.roomData = [1,2,4];
      }
    _init();
    
    // opens modal for viewing hours for a room
    $scope.openModal = function(event) {
        var id = event.target.id;
        $scope.roomSelected=id;
        var num=$scope.roomSelected.substring(4, id.length-1);
        $scope.roomSelected = $scope.roomSelected.substring(0, id.length-1);
        console.log(num);
        $scope.roomIndex = num;
        if ($scope.roomsData[num-1].blocked == false) {
            
            var room = $scope.roomsData[num-1];
            for (var resSlot = 0; resSlot < room.res.length; resSlot++) {
                var reservation = room.res[resSlot];
                var start = reservation.start;
                var end = reservation.end;
                for (var i = start; i <= end; i++) {
                    var name = "#roomModal." + i;
                    var htmlName = "roomModal." + i;
                }
            }
            $("#reserve-modal").modal("toggle");
        }
        else {
			var room = $scope.roomsData[num-1];
			console.log("attempting to open blocked room modal.")
			if($scope.user.admin){
				$("#reserve-block-modal").modal("toggle");
			}else{
				alert("This room is currently blocked");
			}
			console.log("roomselected: " + $scope.roomIndex);
        }
        
    };
    
    //handles mouseover for rooms on the map
    $scope.mouseOver = function(event) {
        var room = "#room"+event+"a";
        $(room).mapster('select');
    };
    
    // handles mouseover for rooms on the map
    $scope.mouseLeave = function(event) {
        var room = "#room"+event+"a";
        if ($scope.roomsData[event-1].blocked == false) {
            $(room).mapster('deselect');
        }
    };
    
    // permanently highlights rooms that are blocked (color change is not working)
    $scope.disableBlockedRooms = function() {
        angular.forEach($scope.roomsData, function(room, index) {
            if (room.blocked) {
                var roomName = "#room" + room.roomid + "a";
                var roomTable = "#room"+room.roomid + "c";
//                $(roomName).mapster('isSelectable',false);
                $(roomName).mapster('set', true);
                $(roomName).css("background-color", 'black');
                $('#map').mapster('set_options',{
                    areas:[
                        {
                            key: room.roomid,
                            fillColor: '000000'
                        }]
                    });
                
            }
        }
                           
    );
    };
    
    // checks blocked status
    $scope.checkBlocked = function(id) {
        if ($scope.roomsData[id-1].blocked) { 
            var name = "#room" + id;
            
			return "Blocked";
            //alert("RoomID: " + id + " is currently blocked");
//            $(name).toggle();
        }
    };
    
    $scope.openHours = function(event) {
        console.log(event.target.id);
    };

    $scope.unblockRoom = function(id) {
        if ($scope.roomsData[id-1].blocked) {
            var name = "#room" + id;
            alert("RoomID: " + id + " is currently blocked");
			$scope.roomsData[id-1].blocked = false;
			//need to add a refresh function to recolor unblocked rooms
//          $(name).toggle();
        }
    };

}).directive('reservationTable', function() {
    // handles the hour by hour modal body for the modal opened on map click
    return {
        restrict: 'E',
        scope: {
            roomData: '=info'
        },
        templateUrl: 'reservation-table.html',
        compile: function(tElem,attrs) {
            return {
                pre: function(scope, iElem, iAttrs){
					//access this data 

                    iElem.children().each(function () {
							/*
						if this.id = "roomModal." + array[0].id
							color red or yellow depending on shareable
*/
                        $(this).children().each(function () {
                            $(this).prop('disabled',true);
                        }) // "this" is the current element in the loop
                            // used to block hours that are taken. Needs outside data that is not being passed properly.
//                            $(this).prop('disabled',true);
                        }) 
                                
                    });
                },
                post: function(scope, iElem, iAttrs){
                    
                }
            }
        }
        
    };
});

// this is the directive for the tabular view to the right of the map
app.directive('timetable', function() {
    return {
      restrict: 'AE',
      scope: {
        slots: '='
      },
      templateUrl: 'my-timetable-iso.html',
      link: function (scope, element, attributes) {
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
