angular.module('app.services', ['ngResource'])

.service('DataService', ['$resource', function($resource){
  var data = null;
  this.loaded = false;

  this.getDataFromServer = function() {
    return $resource('http://172.17.1.113:8443/app/competitions', {
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
    window.localStorage.setItem('app_data', JSON.stringify(json));
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
          for (var i = filteredData.length - 1; i >= 0; i--) {
            if (filteredData[i]._id === id) {
              return filteredData[i];
            }
          };
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
}]);