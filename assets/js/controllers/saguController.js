angular.module('saguApp').controller('saguController', function ($scope, $timeout, explorerResource, explorerService) {

    $scope.currentArea;
    $scope.exploreProgress = 0;
    $scope.map = '';
    $scope.backgroundImage;

    explorerService.getExplorer().then(function (explorer) {
        $scope.explorer = explorer;
        $scope.getNextArea();
    });

    $scope.getNextArea = function () {
        var unCompletedAreas = $scope.explorer.exploredAreas.filter(function (area) {
            return area.amountExplored < area.area.size;
        });

        if (unCompletedAreas.length > 0) {
            $scope.currentArea = Array.maxObject(unCompletedAreas, "area", "order");
            $scope.init();
        } else {
            explorerService.getNextArea($scope.explorer).then(function (area) {
                $scope.currentArea = area;
                $scope.explorer.exploredAreas.push(area);
                $scope.init();
            });
        }
    }

    $scope.init = function () {
        $scope.backgroundImage = $scope.getImageUri($scope.currentArea.area.image);
        $scope.map = $scope.getMap();
        $scope.explore();
    }

    $scope.explore = function () {
        if ($scope.exploreProgress >= 100) {
            $scope.addNewRoom();
        } else {
            $scope.exploreProgress += 15;
        }

        $timeout($scope.explore, 1500);
    };

    $scope.addNewRoom = function () {
        $scope.updateExploredAmount();

        if ($scope.currentArea.amountExplored >= $scope.currentArea.area.size) {
            $scope.getNextArea();
        } else {
            $scope.exploreProgress = 0;
            $scope.map += $scope.getRoom();
            $scope.updateContainerScroll();
        }
    }

    $scope.updateExploredAmount = function () {
        $scope.currentArea.amountExplored++;
        explorerService.updateLocalExplorer($scope.explorer);
    }

    $scope.getMap = function () {
        var map = '';

        for (var i = 0; i < $scope.currentArea.amountExplored; i++) {
            map += $scope.getRoom();
        }

        return map;
    }

    $scope.getRoom = function () {
        return "<div class='room'>//</div>";
    }

    $scope.updateContainerScroll = function () {
        var container = document.getElementsByClassName('map-container')[0];
        container.scrollTop = container.scrollHeight;
    }

    $scope.getImageUri = function (image) {
        var fileName = image.fileName.split('.');
        return image.id + '.' + fileName[fileName.length - 1];
    }
});
