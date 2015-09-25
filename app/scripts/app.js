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

  //add a task
  $scope.addTask = function() {
    var name = $scope.task; 
    $scope.tasks.$add({
      name: $scope.task,
      condition: "active",
      created_at: Firebase.ServerValue.TIMESTAMP
    });

    $scope.task = "";
  };

  //completed task
  $scope.completeTask = function(task) {
    task.condition = "complete";
    $scope.tasks.$save(task);
  };

  
  //expired task called with ngInit
  $scope.expiredTask = function(task) {
    var name = $scope.tasks.$getRecord(task);
    var timestamp = new Date().getTime();
    var timeNow = task.created_at;

    //change to 604800000 after testing
    if(task.condition == "active" && (timestamp - timeNow) >= 60) {
      task.condition = "complete";
      $scope.tasks.$save(task);
    }
  };
}]);

