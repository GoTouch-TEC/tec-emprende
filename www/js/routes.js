angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('competencias', {
    url: '/competitions',
    templateUrl: 'templates/competencias.html',
    controller: 'competenciasCtrl'
  })

  .state('proyectos', {
    url: '/projects',
    templateUrl: 'templates/proyectos.html',
    controller: 'proyectosCtrl'
  })

  .state('votar', {
    url: '/vote',
    templateUrl: 'templates/votar.html',
    controller: 'votarCtrl'
  })

  .state('proyecto', {
    url: '/project',
    templateUrl: 'templates/proyecto.html',
    controller: 'proyectoCtrl'
  })

$urlRouterProvider.otherwise('/competitions')

  

});