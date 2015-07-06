angular.module('saguApp').controller('saguController', function($scope, explorerResource, explorerService){

  $scope.currentArea;

  $scope.explorer = explorerResource.get({id: '59febafa-7435-432d-8f54-bde4484b1b01'}, function(explorer){

    var unCompletedAreas = explorer.exploredAreas.filter(function(area){
      return area.amountExplored < 100;
    });

    if (unCompletedAreas.length > 0){

    }
    else{
        explorerService.getNextArea(explorer).then(function(area){
          $scope.currentArea = area;
        });
      }
  });
});
