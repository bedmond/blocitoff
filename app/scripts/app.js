blocitoff = angular.module('blocitoff', ['ui.router', 'firebase']);

blocitoff.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('home', {
    url: '/',
    controller: 'Home.controller',
    templateUrl: '/templates/home.html'
  });
}]);

blocitoff.controller('Home.controller', ['$scope', '$interval', '$firebaseArray', function($scope, $interval, $firebaseArray) {

  $scope.taskButton = "Add Task";
  $scope.taskTime = 5 * 60;

  $scope.taskCountDown = function() {
    $scope.taskTime -= 100;
    $scope.taskButton = "Add Task";
    if ($scope.taskTime == 0) {
      $scope.stop();
      return true;
    } else {
      return false;
      console.log($scope.taskTime);
    }
  };

  $scope.start = function() {
    $scope.timerSet = $interval($scope.taskCountDown, 1000);
  }

  $scope.stop = function() {
    $interval.cancel($scope.timerSet);
  }

  var ref = new Firebase("https://flickering-fire-4278.firebaseio.com");

  $scope.tasks = $firebaseArray(ref);

  $scope.addTask = function() {
    var name = $scope.task;
    $scope.tasks.$add({
      name: $scope.task,
      created_at: Firebase.ServerValue.TIMESTAMP
    });

    $scope.task = "";
  };

}]);