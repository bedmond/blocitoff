blocitoff = angular.module('blocitoff', ['ui.router', 'firebase', 'ui.sortable']);

blocitoff.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('register', {
    url: '/',
    controller: 'Register.controller',
    templateUrl: '/templates/register.html'
  });

  $stateProvider.state('login', {
    url: '/login',
    controller: 'Login.controller',
    templateUrl: '/templates/login.html'
  });

  $stateProvider.state('home', {
    url: '/home',
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

    if(task.condition == "active" && (timestamp - timeNow) >= 604800000) {
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

//register controller
blocitoff.controller('Register.controller', ['$scope', '$firebaseArray', 'FIREBASE_URL', function($scope, $firebaseArray, FIREBASE_URL) {

  var ref = new Firebase(FIREBASE_URL);

  //register account
  $scope.register = function() {
    ref.createUser({
      email: $scope.userData,
      password: $scope.authData
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        console.log("User account created with uid:", userData.uid);
      }
    });
  }

}]);

//login controller
blocitoff.controller('Login.controller', ['$scope', '$firebaseArray', 'FIREBASE_URL', function($scope, $firebaseArray, FIREBASE_URL) {

  var ref = new Firebase(FIREBASE_URL);
  
  //account login
  $scope.login = function() {
    ref.authWithPassword({
      email: $scope.userData,
      password: $scope.authData
    }, function(error, authData) {
      if (error) {
        console.log("Login failed.", error);
      } else {
        $scope.loggedIn = true; //can use ngIf to show task/complete tasks
        console.log("Authenticated successfully with payload:", authData);
      }
    });
  }

}]);



