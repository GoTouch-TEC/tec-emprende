angular.module('app.services', ['ngResource'])

.service('DataService', ['$resource', function($resource){
  var data = null;
  this.loaded = false;

  this.getDataFromServer = function() {
    return $resource('http://172.19.127.88:8443/app/competitions', {
      competitionId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  };
  /**
   * Set data to the service.
   * @param Object json data to load
   */
  this.setData = function(json, cb) {
    console.log('DEBUG: data changed');
    localStorage.setItem('app_data', JSON.stringify(json));
    data = json;
    this.loaded = true;
    if (typeof cb === "function") {
      cb(json);
    }
  };
  /** Params can be: 
   * competition
   *   Get all competitions
   * competition, id
   *   Get one competition with it's projects
   * project, id
   *   Get one project information
   */
  this.getData = function(filters) {
    // Param validations
    if (typeof filters === "undefined") {
      console.error('Filter is required {model, [id: optional]}');
      return;
    }
    // get some params
    var model = filters.model;
    var id = filters.id;
    if (typeof model === "undefined") {
      console.error('You must specify a model name');
      return;
    }
    // clone the initial object
    var filteredData = JSON.parse(JSON.stringify(data));
    // var filteredData = data.slice();
    console.log('DEBUG: filtered data is:');
    console.log(filteredData);
    switch (model) {
      case 'competition':
        if (typeof id !== "undefined") {
          // User wants one competition data
          for (var i = filteredData.length - 1; i >= 0; i--) {
            if (filteredData[i]._id === id) {
              return filteredData[i];
            }
          };
          console.error('Competition with the specified id [' + id + '] not found');
          return {};
        } else {
          // User wants all competitions array.
          for (var i = filteredData.length - 1; i >= 0; i--) {
            delete filteredData[i].projects;
          };
          return filteredData;
        }
        break;
      case 'project':
        if (typeof id !== "undefined") {
          // User wants one project data
          for (var competitionIndex = filteredData.length - 1; competitionIndex >= 0; competitionIndex--) {
            var actualCompetition = filteredData[competitionIndex]
            for (var projectIndex = actualCompetition.projects.length - 1; projectIndex >= 0; projectIndex--) {
              if (actualCompetition.projects[projectIndex]._id === id) {
                return actualCompetition.projects[projectIndex];
              }
            }
          }
          console.error('Competition with the specified id [' + id + '] not found');
          return {};
        } else {
          console.error('you can\'t get all the projects. Filter them using the (competition,id) model');
        }
        break;
      default:
        console.error('The given model [' + model + '] doesn\'t exists');
        break;
    }
  };
}])

.service('VoteService', ['$http', 'ionicToast', function($http, ionicToast){
  var votes = localStorage.getItem('votes');
  if (votes === null) {
    votes = [];
    localStorage.setItem('votes', '[]');
  } else {
    votes = JSON.parse(votes);
  }
  this.vote = function(projectId) {
    votes.push({
      token: makeId(),
      projectId: projectId,
      date: new Date()
    });
    localStorage.setItem('votes', JSON.stringify(votes));
    this.tryToSendVotes();
    return true;
  }

  var sendVote = function(voteObject) {
    $http.post('http://172.19.127.88:8443/app/vote', voteObject).then(function(result){
      for (var i = votes.length - 1; i >= 0; i--) {
        if (votes[i].token = voteObject.token) {
          votes.splice(i, 1);
          localStorage.setItem('votes', JSON.stringify(votes));
        }
      }
      ionicToast.show('El voto fue enviado correctamente.', 'bottom', false, 3000);
    },function(err){
      for (var i = votes.length - 1; i >= 0; i--) {
        if (votes[i].token = voteObject.token) {
          votes[i].sending = false;
        }
      }
      ionicToast.show('Error while sending the vote.', 'bottom', false, 6000);
      console.error(err);
    });
  };

  var makeId = function() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 16; i++ ) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  };

  this.tryToSendVotes = function() {
    if(navigator.connection.type != Connection.NONE) {
      for (var i = votes.length - 1; i >= 0; i--) {
        if (!votes[i].sending) {
          votes[i].sending = true;
          sendVote(votes[i]);
        }
      };
    }
  };

}]);