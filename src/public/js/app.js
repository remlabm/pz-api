var eventApp = angular.module('eventApp', ['ngRoute', 'eventControllers']);

eventApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/events', {
        templateUrl: 'partials/event-list.html',
        controller: 'EventListCtrl'
      }).
      when('/events/create', {
        templateUrl: 'partials/event-create.html',
        controller: 'EventCreateCtrl'
      }).
      when('/events/delete/:eventId', {
        templateUrl: 'partials/event-delete.html',
        controller: 'EventDeleteCtrl'
      }).
      when('/events/detail/:eventId', {
        templateUrl: 'partials/event-detail.html',
        controller: 'EventDetailCtrl'
      }).
      when('/events/edit/:eventId', {
        templateUrl: 'partials/event-create.html',
        controller: 'EventEditCtrl'
      }).
      otherwise({
        redirectTo: '/events'
      });
}]);