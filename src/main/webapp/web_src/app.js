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
            blocked:false,
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
            blocked:false,
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
        $("#reserve-modal").modal("toggle");
        console.log($scope.roomSelected);
    };
    $scope.mouseOver = function(event) {

//        console.log(event);
        var room = "#room"+event+"a";
        $(room).mapster('select');
    }
    $scope.mouseLeave = function(event) {

//        console.log("leaving " + event);
        var room = "#room"+event+"a";
        $(room).mapster('deselect');
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