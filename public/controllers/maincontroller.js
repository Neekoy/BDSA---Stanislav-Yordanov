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

app.controller('mainController', function($sce, $scope, $rootScope, $http, $cookies, $window, $timeout, $location, $anchorScroll) {

$( function() {
    $( "#datepicker" ).datepicker();
} );

$scope.webinarHost = "";
this.webinarVid = "";
$scope.webinarDates = [];
this.webinarAddInfo = [];
$scope.webinarNames = [];

this.chosenWebinar = function(index) {
    this.chosenWebClass = index;
}

var weekday = new Array(7);
weekday[0] =  "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

if (angular.element('#secondpage').length) {
    socket.emit("getWebinarInfo", 2);
} else {
    socket.emit("getWebinarInfo", 1);
}

socket.emit("getWebinarNames", "");

socket.on("sendWebinarNames", function(data) {
    for (item in data) {
        if (data[item].active === true) {
            $scope.webinarNames.push(data[item].name);
        }
    }
    $scope.$applyAsync();
})

socket.on("receiveWebinarNames", function(data) {
    console.log(data);
});


socket.on("receiveWebinarInfo", function(data) {

  if (document.getElementById("days") !== null) {
    console.log("TEST " + data);

    for (item in data.dates) {
        console.log(data.dates[item]);
      newDate = data.dates[item].date.split("/");
      data.dates[item].date = newDate[2] + "-" + newDate[0] + "-" + newDate[1];
      tempDate = new Date(data.dates[item].date + " " + data.dates[item].hour + ":" + data.dates[item].minute);
        console.log(data.dates[item].date);
        console.log(tempDate);
      data.dates[item].dayOfWeek = weekday[tempDate.getDay()];
      tempUnixTime = tempDate.getTime();
      data.dates[item].unixTime = tempUnixTime;
    }

    $scope.webinarHost = data.host;
    $scope.webinarDates = data.dates;
    $scope.webinarAddInfo = data.addinfo;
    $scope.webinarVideo = $sce.trustAsResourceUrl(data.video);

    $scope.countDownDate = data.dates[0].unixTime;
    var now = new Date().getTime();

    // Find the distance between now an the count down date
    var distance = $scope.countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    document.getElementById("days").innerHTML = days;
    document.getElementById("hours").innerHTML = hours;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;

  }

  $scope.$applyAsync();
});

if (document.getElementById("days") !== null) {

// Set the date we're counting down to

// Update the count down every 1 second
var x = setInterval(function() {

  // Get todays date and time
  var now = new Date().getTime();

  // Find the distance between now an the count down date
  var distance = $scope.countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("days").innerHTML = days;
  document.getElementById("hours").innerHTML = hours;
  document.getElementById("minutes").innerHTML = minutes;
  document.getElementById("seconds").innerHTML = seconds;

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("timer").innerHTML = "EXPIRED";
  }
}, 1000);

}

});

app.controller('adminController', function($scope, $rootScope, $http, $cookies, $window, $timeout, $location, $anchorScroll) {

$scope.currentWebinar = 1;
$scope.currentWebinarName = "Първи уебинар";
this.webinarActivated = true;
this.webinarTrue = false;

this.changeCurrentWebinar = function (data) {
    $scope.currentWebinar = data;
    if (data === 1) {
        $scope.currentWebinarName = "Първи уебинар";
    } else {
        $scope.currentWebinarName = "Втори уебинар";
    }
    console.log($scope.currentWebinar);
}

this.webinarActivate = function() {
    if (this.webinarActivated === true) {
        this.webinarTrue = true;
        this.webinarActivated = "webinarActive";
    } else {
        this.webinarTrue = false;
        this.webinarActivated = "webinarInactive";
    }
}

this.displayWebinar = true;
this.displayUsers = false;
this.displayContent = false;
this.webinarName = "";
this.webinarUrl = "";
this.webinarHost = "";
this.webinarDates = [{
  date: "",
  hour: "Час",
  minute: "Минути",
}];

this.webinarAddInfo = [{
  header: "Заглавие",
  content: "Съдържание",
}]

this.addNewDate = function() {
  info = {
    date: "",
    hour: "Час",
    minute: "Минути",
  }
  this.webinarDates.push(info);
  console.log(this.webinarDates);
}

this.addNewInfoField = function() {
  info = {
    header: "Заглавие",
    content: "Съдържание",
  }
  this.webinarAddInfo.push(info);
}

this.clearField = function(data, index) {
  for (item in this.webinarDates) {
    if (this.webinarDates[item].$$hashKey === data.$$hashKey) {
      if (index === 'hour') {
        this.webinarDates[item].minute= "";
      } else {
        this.webinarDates[item].hour= "";
      }
    }
  }
}

this.changeWebinar = function() {
  info = {
    active: this.webinarTrue,
    webinarNum: $scope.currentWebinar,
    webinarName: this.webinarName,
    webinar: this.currentWebinar,
    host: this.webinarHost,
    video: this.webinarUrl,
    dates: this.webinarDates,
    addinfo: this.webinarAddInfo,
  }
  for (item in info.dates) {
    delete info.dates[item]["$$hashKey"];
  }
  for (item in info.addinfo) {
    delete info.addinfo[item]["$$hashKey"];
  }

  this.showText2 = true;
    console.log(info);
  socket.emit('addWebinarInfo', info);
}

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
    this.displayWebinar = false;
  } else if (data === "webinar") {
    this.displayUsers = false;
    this.displayContent = false;
    this.displayWebinar = true;
	} else {
		this.displayUsers = false;
		this.displayContent = true;
    this.displayWebinar = false;
	}
}

this.changeBulletin = function() {
    data = {
      webinar: $scope.currentWebinar,
      bulletinContent: this.bulletinContent,
      bulletinSubject: this.bulletinSubject,
    }
    socket.emit("bulletinChange", data);
    this.showText = true;
}

});
