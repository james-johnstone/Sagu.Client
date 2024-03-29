angular.module('saguApp').factory('explorerService', function ($q, $cookieStore, explorerResource, areaResource, exploredAreaResource) {

    var explorerService = {};

    explorerService.getExplorer = function(){
      var defer = $q.defer();

      var explorer = $cookieStore.get('explorer');

      if (!!explorer)
        defer.resolve(explorer);
      else
        explorerService.createExplorer({Name : 'new explorer'}).then(function(explorer){
                                   explorerService.updateLocalExplorer(explorer);
                                   defer.resolve(explorer);
                                  });

      return defer.promise;
    };

    explorerService.createExplorer = function(explorer){
       var defer = $q.defer();
       var newExplorer = new explorerResource();

       angular.extend(newExplorer, explorer);

       newExplorer.$save().then(function (explorer) {
                defer.resolve(explorer);
            }, function (response) {
                defer.reject(response.data.reason);
            });
            return defer.promise;
    };

    explorerService.updateLocalExplorer = function(explorer){
      $cookieStore.put('explorer', explorer);
    };

    explorerService.updateExploredAreas = function(explorer){
      var exploredAreas = explorer.exploredAreas;

      for (var i = 0; i < exploredAreas.length; i++) {
        exploredAreaResource.update(exploredAreas[i].id,exploredAreas[i]);
      }
    }

    explorerService.getNextArea = function (explorer) {
        explorerService.updateExploredAreas(explorer);

        return areaResource.query().$promise
            .then(function (areas) {
            return explorerService.creareNewAreaToExplore(areas, explorer.exploredAreas, explorer);
        });
    };

    explorerService.creareNewAreaToExplore = function (areas, exploredAreas, explorer) {
        var defer = $q.defer();
        var nextArea = explorerService.getNextUnexploredArea(areas, exploredAreas);

        if (!nextArea)
          return;

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
            return completedAreas.indexOf(area.id) === -1;
        });

        return Array.minObject(unExploredAreas, 'order');
    }

    return explorerService;
})
