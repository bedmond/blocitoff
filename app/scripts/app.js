blocitoff = angular.module('blocitoff', ['ui.router', 'firebase', 'ui.sortable']);

blocitoff.run(['$rootScope', '$state', function($rootScope, $state) {
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    if (error === 'AUTH_REQUIRED') {
      $state.go('login');
    }
  });
}]);

blocitoff.factory('Auth', ['$firebaseAuth', 'FIREBASE_URL',
  function($firebaseAuth, FIREBASE_URL) {
    var ref = new Firebase(FIREBASE_URL);
    return $firebaseAuth(ref);
  }]);

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
    templateUrl: '/templates/login.html',
    resolve: {
      "currentAuth": ['Auth', function(Auth) {
        return Auth.$waitForAuth();
      }]
    }
  });

  $stateProvider.state('home', {
    url: '/home',
    controller: 'Home.controller',
    templateUrl: '/templates/home.html',
    resolve: {
      "currentAuth": ['Auth', function(Auth) {
        return Auth.$requireAuth();
      }]
    }
  });

  $stateProvider.state('complete', {
    url: '/complete',
    controller: 'Complete.controller',
    templateUrl: '/templates/complete.html'
  });

}]);

//create Firebase constant
blocitoff.constant('FIREBASE_URL', 'https://flickering-fire-4278.firebaseio.com');

blocitoff.controller('Home.controller', ['$scope', '$firebaseArray', 'FIREBASE_URL', 'currentAuth', function($scope, $firebaseArray, FIREBASE_URL, currentAuth) {

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
blocitoff.controller('Register.controller', ['$scope', '$firebaseArray', 'Auth', function($scope, $firebaseArray, Auth) {

  //register account
  $scope.createUser = function() {
    $scope.message = null;
    $scope.error = null;

    Auth.$createUser({
      email: $scope.email,
      password: $scope.password
    }).then(function(userData) {
      console.log("User created with uid: " + userData.uid);
    }).catch(function(error) {
      $scope.error = error;
      console.log("Error: ", error);
    });
  }
}]);


//login controller
blocitoff.controller('Login.controller', ['$scope', '$firebaseArray', '$firebaseAuth', 'FIREBASE_URL', 'currentAuth', 'Auth', function($scope, $firebaseArray, $firebaseAuth, FIREBASE_URL, currentAuth, Auth) {

  $scope.auth = Auth;

  $scope.auth.$onAuth(function(authData) {
    $scope.authData = authData;
    console.log(authData);
  });

  console.log(Auth);

  var ref = new Firebase(FIREBASE_URL);
  $scope.authObj = $firebaseAuth(ref);

  $scope.login = function() {
    $scope.message = null;
    $scope.error = null;

    $scope.authObj.$authWithPassword({
      email: $scope.email,
      password: $scope.password
    }).then(function(authData) {
      console.log("Logged in as:", authData.uid);
      $scope.loggedIn = true;
    }).catch(function(error) {
      console.error("Authentication failed:", error);
    });
  }

  $scope.logout = function() {
    ref.unauth();
  };
  
}]);





