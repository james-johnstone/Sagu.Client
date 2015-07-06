angular.module('saguApp').factory('explorerService', function($q, areaResource, exploredAreaResource){

  var explorerService = {};

    explorerService.getNextArea = function(explorer){

      var promises = {
        areas: areaResource.query().$promise,
        exploredAreas: exploredAreaResource.query({explorerId:explorer.id}).$promise
      };

      var area =  $q.defer();

      $q.all(promises)
                    .then(function(values) {
                      var area = $q.defer();

                      explorerService.creareNewAreaToExplore(values.areas,values.exploredAreas, explorer).then(function(newArea){
                        area.resolve(newArea);
                      });

                      return area.promise;
                  }).then(function(newArea){
                      area.resolve(newArea);
                  });

      return area.promise;
    };

    explorerService.creareNewAreaToExplore = function(areas, exploredAreas, explorer){
      var defer = $q.defer();

      var completedAreas = exploredAreas.map(function(ex){return ex.area.id});
      var unExploredAreas = areas.filter(function(area){
        return exploredAreas.indexOf(area.id) === -1;
      });

      if (unExploredAreas.length > 0){
          var nextArea = Array.minObject(unExploredAreas, 'order');
          var areaToExplore = {
            area : nextArea,
            explorerId : explorer.id,
            amountExplored : 0
          };

          var newAreaToExplore = new exploredAreaResource(areaToExplore);

          newAreaToExplore.$save().then(function () {
              defer.resolve(newAreaToExplore);
              }, function (response) {
                  defer.reject(response.data.reason);
          });
          return defer.promise;
      }
    };

    return explorerService;
})



    Array.minObject = function (array, prop) {
        var values = array.filter(function (el) {
            return !!el[prop] || el[prop] === 0;
        }).map(function (el) {
            return el[prop];
        });

        var minIndex = values.indexOf(Math.min.apply(Math, values));
        return array[minIndex]
    };
