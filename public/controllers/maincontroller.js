console.log("Greetings from the main controller.");

var socket = io();

var app = angular.module('mainApp', ['ngCookies']);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

app.controller('mainController', function($scope, $rootScope, $http, $cookies, $window, $timeout, $location, $anchorScroll) {

});

app.controller('adminController', function($scope, $rootScope, $http, $cookies, $window, $timeout, $location, $anchorScroll) {

this.displayUsers = true;
this.displayContent = false;

socket.emit('getAllUsers');

socket.on('sendAllUsers', function(data){

	for (entry in data) {
		epochTime = data[entry].time;
		var D = new Date(epochTime);
		data[entry].time = D.getDay() + "." + D.getMonth() + "." + D.getFullYear();;
	}

	this.userData = data;
	console.log(this.userData);
	$scope.$apply();
}.bind(this));

this.displayNum = 5;
this.displayStart = 0;

this.next = function() {
    arrLength = Object.keys(this.userData).length;
    if (this.displayStart + 4 > arrLength) {
	    console.log("Nothing to do");
	    return;
    }
    this.displayStart += 5; 
}

this.previous = function() {
     if (this.displayStart >= 5) {
         this.displayStart -= 5;
     }
}

this.switchPage = function(data) {
	console.log(data);
	if (data === "users") {
		this.displayUsers = true;
		this.displayContent = false;
	} else {
		this.displayUsers = false;
		this.displayContent = true;
	}
}

this.changeBulletin = function() {
    socket.emit("bulletinChange", this.bulletinContent);
    this.showText = true;
}

});
