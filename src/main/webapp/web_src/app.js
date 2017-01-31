//app.js, handles frontend functionality.


//BEFORE HOOKING UP WITH BACKEND
var app = angular.module("myApp", []);
app.controller("myCtrl", function($scope) {
    $scope.firstName = "John";
    $scope.lastName = "Doe";
 	$scope.roomsData  = [];


	//functions go in here.
  	$scope.addRoom = function(id, name, capacity) {
		console.log("adding room id: " + id);
		var roomData = 
		{
			"id":id,
			"name":name,
			"capacity":capacity
		};
		$scope.roomsData.push(roomData);
		$scope.roomData = "";
	
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
