blocitoff = angular.module('blocitoff', ['ui.router', 'firebase']);

blocitoff.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('home', {
    url: '/',
    controller: 'Home.controller',
    templateUrl: '/templates/home.html'
  });
}]);

blocitoff.controller('Home.controller', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
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