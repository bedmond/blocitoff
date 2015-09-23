blocitoff = angular.module('blocitoff', ['ui.router', 'firebase']);

blocitoff.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('home', {
    url: '/',
    controller: 'Home.controller',
    templateUrl: '/templates/home.html'
  });
}]);

//create Firebase constant
blocitoff.constant('FIREBASE_URL', 'https://flickering-fire-4278.firebaseio.com');

blocitoff.controller('Home.controller', ['$scope', '$firebaseArray', 'FIREBASE_URL', function($scope, $firebaseArray, FIREBASE_URL) {

  //retrieve stored tasks
  var ref = new Firebase(FIREBASE_URL);

  $scope.tasks = $firebaseArray(ref);

  //update the completed task
  $scope.changeStatus = function(task) {

    //update the task - use this to hide/show on complete
    var name = $scope.task;
    $scope.tasks.$add({
      name: $scope.task,
      completed: !task.completed
    });   
  }

  //add a task
  $scope.addTask = function() {

    //create unique id
    var timestamp = new Date().getTime() //maybe use new Date().valueOf()

    var name = $scope.task;
    $scope.tasks.$add({
      id: timestamp,
      name: $scope.task,
      completed: false
    });

    $scope.task = "";
  };

  //countdown for expired task, still not working
  $scope.taskCountDown = function(task) {

    var completedTaskDate = $scope.task - 150; //shorter test time
    if ($scope.task < completedTaskDate)
      return true; //hides task
    else
      return false; //shows task
  }

}]);