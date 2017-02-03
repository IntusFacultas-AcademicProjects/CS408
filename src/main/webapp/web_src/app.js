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
   

    $scope.isCollapsed = true;
    $scope.roomsData  = [
        {
            blocked:true,
            res: {},
            day: 1,
            roomid:1
        },
        {
            blocked:false,
            res: {},
            day: 1,
            roomid:2
        },
        {
            blocked:true,
            res: {},
            day: 1,
            roomid:3
        },
        {
            blocked:false,
            res: {},
            day: 1,
            roomid:4
        },
        {
            blocked:false,
            res: {},
            day: 1,
            roomid:5
        },
        {
            blocked:false,
            res: {},
            day: 1,
            roomid:6
        },
        {
            blocked:false,
            res: {},
            day: 1,
            roomid:7
        },
        {
            blocked:false,
            res: {},
            day: 1,
            roomid:8
        },
        {
            blocked:false,
            res: {},
            day: 1,
            roomid:9
        },
        {
            blocked:false,
            res: {},
            day: 1,
            roomid:10
        },
        {
            blocked:false,
            res: {},
            day: 1,
            roomid:11
        },
        {
            blocked:false,
            res: {},
            day: 1,
            roomid:12
        },
        {
            blocked:false,
            res: {},
            day: 1,
            roomid:13
        },
        {
            blocked:false,
            res: {},
            day: 1,
            roomid:14
        },
        {
            blocked:false,
            res: {},
            day: 1,
            roomid:15
        },
        {
            blocked:false,
            res: {},
            day: 1,
            roomid:16
        },
        {
            blocked:false,
            res: {},
            day: 1,
            roomid:17
        },
        {
            blocked:false,
            res: {},
            day: 1,
            roomid:18
        },
        {
            blocked:false,
            res: {},
            day: 1,
            roomid:19
        }
    ];
    $scope.roomSelected;
    $scope.openModal = function(event) {
        var id = event.target.id;
        $scope.roomSelected=id;
        $scope.roomSelected=$scope.roomSelected.substring(0, id.length-1);
        var num = $scope.roomSelected.substring($scope.roomSelected.length -1);
        console.log(num);
        if ($scope.roomsData[num-1].blocked == false) {
            $("#reserve-modal").modal("toggle");
        }
        else {
            alert("This room is currently blocked");
        }
        
    };
    $scope.mouseOver = function(event) {

        var room = "#room"+event+"a";
        $(room).mapster('select');
    }
    $scope.mouseLeave = function(event) {
        var room = "#room"+event+"a";
        if ($scope.roomsData[event-1].blocked == false) {
            $(room).mapster('deselect');
        }
    }
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
                console.log(roomTable);
                
            }
        }
                           
    );
    }
    $scope.checkBlocked = function(id) {
        if ($scope.roomsData[id-1].blocked) {
            
            var name = "#room" + id;
            
            alert("This room is currently blocked");
//            $(name).toggle();
        }
    }
});

app.controller("reservation-modal", function($scope) {
    
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