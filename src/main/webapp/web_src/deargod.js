var resApp = angular.module('resMod', []);
resApp.controller('resCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.send = {username: "John", email: "uiweh", password: "fuck this"};

	$scope.user = {
        username: String,
        password: String,
        email: String
    };

	$scope.user.username = "John";
	$scope.user.password = "passpass123";
	$scope.user.email = "email@aol.com";

var req = {
 method: 'POST',
 url: 'http://data.cs.purdue.edu:8888/api/addAccount',
 headers: {
    'Content-Type': 'application/json',
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': 'Content-Type'
 },
 data: { username: "John", email: "uiweh", password: "fuck this" }
}

	
	//functions go in here...
  	$scope.sendData = function() {
		console.log($scope.user);
    	$http.post("http://data.cs.purdue.edu:8888/api/addAccount", $scope.user).then(function (resp) {
	            console.log("success ", resp);
	        }, function(resp){
				console.log("failure ", resp);
			}
		);
    		
	};

  	$scope.login = function() {
		console.log($scope.user);
    	$http.post("http://data.cs.purdue.edu:8888/api/authAccount", $scope.user).then(function (resp) {
	            console.log("success ", resp);
	        }, function(resp){
				console.log("failure ", resp);
			}
		);
    		
	};

}]);
