angular.module('saguApp').factory('explorerService', function ($q, $cookieStore, explorerResource, areaResource, exploredAreaResource) {

    var explorerService = {};

    explorerService.getExplorer = function(){
      var defer = $q.defer();

      var explorer = $cookieStore.get('explorer');

      if (!!explorer)
        defer.resolve(explorer);
      else
         explorerResource.get({id: '59febafa-7435-432d-8f54-bde4484b1b01'},
                                function(explorer){
                                   explorerService.updateLocalExplorer(explorer);
                                   defer.resolve(explorer);
                                  });

      return defer.promise;
    };

    explorerService.updateLocalExplorer = function(explorer){
      $cookieStore.put('explorer', explorer);
    };

    explorerService.getNextArea = function (explorer) {

        var promises = {
            areas: areaResource.query().$promise,
            exploredAreas: exploredAreaResource.query({
                explorerId: explorer.id
            }).$promise
        };

        return $q.all(promises)
            .then(function (values) {
            return explorerService.creareNewAreaToExplore(values.areas, values.exploredAreas, explorer);
        });
    };

    explorerService.creareNewAreaToExplore = function (areas, exploredAreas, explorer) {
        var defer = $q.defer();
        var nextArea = explorerService.getNextUnexploredArea(areas, exploredAreas);
        var areaToExplore = {
            area: nextArea,
            explorerId: explorer.id,
            amountExplored: 0
        };

        var newAreaToExplore = new exploredAreaResource(areaToExplore);

        if (!newAreaToExplore) return;

        newAreaToExplore.$save().then(function () {
            defer.resolve(newAreaToExplore);
        }, function (response) {
            defer.reject(response.data.reason);
        });

        return defer.promise;
    };

    explorerService.getNextUnexploredArea = function (areas, exploredAreas) {
        var completedAreas = exploredAreas.map(function (ex) {
            return ex.area.id
        });
        var unExploredAreas = areas.filter(function (area) {
            return exploredAreas.indexOf(area.id) === -1;
        });

        return Array.minObject(unExploredAreas, 'order');
    }

    return explorerService;
})
