angular.module('app.controllers', [])
  
.controller('competenciasCtrl', function($scope, DataService, $state, $ionicNavBarDelegate) {
	$ionicNavBarDelegate.showBackButton(false);
	if (!DataService.loaded) {
		console.log('DEBUG: data is not available');
		$state.go('sync');
	}
	$scope.$watch(function () { return DataService.loaded }, function (newVal, oldVal) {
		if (typeof newVal !== 'undefined' && DataService.loaded) {
			console.log('DEBUG: data is available');
			$scope.competitions = DataService.getData({ model: 'competition' });
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
	$scope.search = "";
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
	$scope.canVote = false;
	var password = ['left', 'left', 'right', 'double', 'hold', 'left'];
	var easterIndex = 0;
	$scope.swipeEasterEgg = function(direction) {
		if (!$scope.canVote && direction === password[easterIndex]){
			easterIndex ++;
			if (easterIndex === password.length) {
				$scope.canVote = true;
			}
		} else {
			easterIndex = 0;
		}
	};
	// $scope.goToVote = function() {
	// 	console.log('clicked');
	// 	$state.go('vote', { competitionId: competition._id });
	// };
})
   
.controller('votarCtrl', function($scope, VoteService, DataService, $ionicPopup, $stateParams, $state, $ionicNavBarDelegate) {
	if (!DataService.loaded) {
		console.log('DEBUG: data is not available');
		$state.go('sync');
	}
	$scope.selectedProject = null;
	$ionicNavBarDelegate.showBackButton(true);
	$scope.$watch(function () { return DataService.loaded }, function (newVal, oldVal) {
		if (typeof newVal !== 'undefined' && DataService.loaded) {
			$scope.competition = DataService.getData({ model: 'competition', id: $stateParams.competitionId });
		}
	});
	$scope.selectProject = function(index) {
		$scope.selectedProject = $scope.competition.projects[index];
	};
	$scope.vote = function() {
		VoteService.vote($scope.selectedProject._id);
        $ionicPopup.alert({
          title: 'Voto Realizado',
          template: 'Su voto ha sido registrado correctamente.'
        })
        .then(function(result) {
          $scope.selectedProject = null;
        });
	};
})
   
.controller('proyectoCtrl', function($scope, $stateParams, DataService, $state, $ionicNavBarDelegate) {
	$ionicNavBarDelegate.showBackButton(true);
	if (!DataService.loaded) {
		console.log('DEBUG: data is not available');
		$state.go('sync');
	}
	$scope.$watch(function () { return DataService.loaded }, function (newVal, oldVal) {
		if (typeof newVal !== 'undefined' && DataService.loaded) {
			console.log('DEBUG: data is available');
			$scope.project = DataService.getData({ model: 'project', id: $stateParams.projectId });
			console.log('DEBUG: Competitions data is:');
			console.log($scope.project);
		}
	});
});