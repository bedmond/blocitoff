blocitoff = angular.module('blocitoff', ['ui.router', 'firebase', 'ui.sortable']);

blocitoff.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('home', {
    url: '/',
    controller: 'Home.controller',
    templateUrl: '/templates/home.html'
  });

  $stateProvider.state('complete', {
    url: '/complete',
    controller: 'Complete.controller',
    templateUrl: '/templates/complete.html'
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
      created_at: Firebase.ServerValue.TIMESTAMP,
      priority: -1
    });

    $scope.task = "";

  };

    //function to sort 
  $scope.sortableOptions = {
    update: function(event, ui) {
      $scope.tasks.forEach(function(task) {
        task.priority = $scope.tasks.indexOf(task);
        $scope.tasks.$save(task);
      });
    }
  }

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
    if(task.condition == "active" && (timestamp - timeNow) >= 600000) {
      task.condition = "complete";
      $scope.tasks.$save(task);
    }
  };
}]);

blocitoff.controller('Complete.controller', ['$scope', '$firebaseArray', 'FIREBASE_URL', function($scope, $firebaseArray, FIREBASE_URL) {

  //retrieve stored tasks
  var ref = new Firebase(FIREBASE_URL);

  $scope.tasks = $firebaseArray(ref);

}]);

