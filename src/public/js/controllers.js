var eventControllers = angular.module('eventControllers', []);
eventControllers.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.headers.patch = {
    'Content-Type': 'application/json;charset=utf-8'
  }
}]);

eventControllers.constant('serviceUrl', '/events');
eventControllers.directive('ngError', function() {
  return {
    restrict: 'E',
    scope: {
      field: '=field'
    },
    template: '<p ng-show="field">{{field.message}}</p>'
  }
});

eventControllers.directive('ngTags', function() {
  return {
    restrict: 'E',
    scope: {
      tags : '=tags'
    },
    template: '<span class="label label-primary" ng-repeat="tag in tags">{{tag}}</span>'
  }
});

eventControllers.controller('EventListCtrl', ['$scope', '$http', 'serviceUrl',
  function($scope, $http, serviceUrl) {
    $scope.load = function() {
      $http.get(serviceUrl)
          .success(function(events) {
            $scope.events = events;
          });
    }

    $scope.load();
  }
]);

eventControllers.controller('EventDetailCtrl', ['$scope', '$routeParams', '$http', 'serviceUrl',
  function($scope, $routeParams, $http, serviceUrl) {
    $scope.load = function() {
      $http.get(serviceUrl + '/' + $routeParams.eventId)
          .success(function(event) {
            $scope.event = event;
          });
    }

    $scope.load();
  }
]);

eventControllers.controller('EventDeleteCtrl', ['$scope', '$routeParams', '$http', '$location', 'serviceUrl',
  function($scope, $routeParams, $http, $location, serviceUrl) {
    $scope.load = function() {
      $http.get(serviceUrl + '/' + $routeParams.eventId)
          .success(function(event) {
            $scope.event = event;
          });
    }

    $scope.delete = function() {
      $http({
        method : 'DELETE',
        url : serviceUrl + '/' + $routeParams.eventId
      }).success(function() {
        $location.path('/events');
      });
    }

    $scope.load();
  }
]);

eventControllers.controller('EventCreateCtrl', ['$scope', '$routeParams', '$http', '$location', 'serviceUrl',
  function($scope, $routeParams, $http, $location, serviceUrl) {
    $scope.createEvent = function() {
      $http.post(serviceUrl, $scope.event)
          .success(function() {
            $location.path('/events');
          })
          .error(function(message) {
            $scope.errors = message.errors;
          });
    };
  }
]);

eventControllers.controller('EventEditCtrl', ['$scope', '$routeParams', '$http', '$location', 'serviceUrl',
  function($scope, $routeParams, $http, $location, serviceUrl) {
    $scope.load = function() {
      $http.get(serviceUrl + '/' + $routeParams.eventId)
          .success(function(event) {
            $scope.event = event;
          });
    }

    $scope.save = function() {
      $http({
        method : 'PATCH',
        url : serviceUrl + '/' + $routeParams.eventId,
        data : $scope.event
      }).success(function() {
        $location.path('/events');
      })
          .error(function(message) {
            $scope.errors = message.errors;
          });
    }

    $scope.load();
  }
]);