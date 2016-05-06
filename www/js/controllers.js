angular.module('app.controllers', [])
  
.controller('competenciasCtrl', function($scope, DataService, $state, $ionicNavBarDelegate) {
	if (!DataService.loaded) {
		console.log('DEBUG: data is not available');
		$state.go('sync');
	}
	$scope.$watch(function () { return DataService.loaded }, function (newVal, oldVal) {
		if (typeof newVal !== 'undefined' && DataService.loaded) {
			console.log('DEBUG: data is available');
			$scope.competitions = DataService.getData({ model: 'competition' });
			$ionicNavBarDelegate.showBackButton(false);
			console.log('DEBUG: Competitions data is:');
			console.log($scope.competitions);
		}
	});
})
   
.controller('proyectosCtrl', function($scope, $stateParams, DataService, $state, $ionicNavBarDelegate) {
	if (!DataService.loaded) {
		console.log('DEBUG: data is not available');
		$state.go('sync');
	}
	$ionicNavBarDelegate.showBackButton(true);
	$scope.projects = [];
	$scope.noMoreItemsAvailable = false;
	$scope.$watch(function () { return DataService.loaded }, function (newVal, oldVal) {
		if (typeof newVal !== 'undefined' && DataService.loaded) {
			$scope.competition = DataService.getData({ model: 'competition', id: $stateParams.competitionId });
			console.log('DEBUG: Competition data is:');
			console.log($scope.competition);
			$scope.loadMore();
		}
	});
	$scope.loadMore = function() {
		if (DataService.loaded){
			$scope.projects.push($scope.competition.projects[0]);
			$scope.competition.projects.shift();
			if ( !$scope.competition.projects.length ) {
				$scope.noMoreItemsAvailable = false;
			}
			$scope.$broadcast('scroll.infiniteScrollComplete');
		}
	};
})
   
.controller('votarCtrl', function($scope) {

})
   
.controller('proyectoCtrl', function($scope) {

});