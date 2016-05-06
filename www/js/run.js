angular.module('app.runs', [])
  .run(function($ionicPlatform, $ionicPopup, DataService, $state, $timeout){
    $ionicPlatform.ready(function() {
      console.log('DEBUG: starting');
      if(typeof(Storage) === "undefined") {
        $ionicPopup.confirm({
          title: 'LocalStorage not supported',
          content: 'Sorry, no local storage support in this device.'
        })
        .then(function(result) {
          ionic.Platform.exitApp();
        });
      }
      console.log('DEBUG: LocalStorage supported');
      var data = localStorage.getItem("app_data");
      if(window.Connection) {
        console.log('DEBUG: checking for connectivity');
        // No connection available, try with local data
        if(navigator.connection.type == Connection.NONE) {
          console.log('DEBUG: No internet connectivity');
          // Get local variable
          if (data === null) {
            console.log('DEBUG: No local data available, throwing errror');
            // If there's no internet and no local data then throw an error
            $ionicPopup.confirm({
              title: 'No Internet Connection',
              content: 'Sorry, no Internet connectivity detected. Please reconnect and try again to sync with the server.'
            })
            .then(function(result) {
              ionic.Platform.exitApp();
            });
          } else {
            console.log('DEBUG: local variable found, set service value and go to home.');
            // Set competition data with localStorage information and continue
            DataService.setData(JSON.parse(data));
            $state.go('competitions');
          }
        } else {
          console.log('DEBUG: internet connectivity available');
          // Get information from internet
          DataService.getDataFromServer().query(function(result){
            console.log('DEBUG: data retrieved');
            console.log(result);
            DataService.setData(result, function(){
              console.log('DEBUG: data set completed, service state is: ' + DataService.loaded );
              $state.go('competitions');
            });
          }, function(err){
            console.log('DEBUG: error');
          });
        }
      }
    });
  });