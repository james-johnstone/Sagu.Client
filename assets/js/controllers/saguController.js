angular.module('saguApp').controller('saguController', function ($scope, explorerResource, explorerService) {

    $scope.currentArea;

    $scope.explorer = explorerResource.get({
        id: '59febafa-7435-432d-8f54-bde4484b1b01'
    }, function (explorer) {

        var unCompletedAreas = explorer.exploredAreas.filter(function (area) {
            return area.amountExplored < area.area.size;
        });

        if (unCompletedAreas.length > 0) {
            $scope.currentArea = Array.maxObject(unCompletedAreas, "area", "order");
            $scope.explore();
        }
        else {
            explorerService.getNextArea(explorer).then(function (area) {
                $scope.currentArea = area;
                $scope.explore();
            });
        }
    });

    $scope.explore = function(){

    };
});
