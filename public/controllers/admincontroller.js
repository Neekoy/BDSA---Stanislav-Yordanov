console.log('Admin controller and stuff');
app.controller('adminController', function($scope, $rootScope, $http, $cookies, $window, $timeout, $location, $anchorScroll) {

socket.emit('getAllUsers');

socket.on('sendAllUsers', function(data){
	console.log(data);
});

});
