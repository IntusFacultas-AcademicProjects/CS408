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
        }
    ];
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
