angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

  .state('competitions', {
    url: '/competitions',
    templateUrl: 'templates/competencias.html',
    controller: 'competenciasCtrl'
  })

  .state('projects', {
    url: '/projects/:competitionId',
    templateUrl: 'templates/proyectos.html',
    controller: 'proyectosCtrl'
  })

  .state('vote', {
    url: '/vote/:competitionId',
    templateUrl: 'templates/votar.html',
    controller: 'votarCtrl'
  })

  .state('project', {
    url: '/project/:projectId',
    templateUrl: 'templates/proyecto.html',
    controller: 'proyectoCtrl'
  })

  .state('sync', {
    url: '/sync',
    templateUrl: 'templates/sync.html'
  });

  $urlRouterProvider.otherwise('/sync')
});