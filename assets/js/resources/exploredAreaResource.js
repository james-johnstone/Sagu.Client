angular.module('saguApp').factory('exploredAreaResource', function ($resource) {
    var exploredAreaResource = $resource('http://saguapi.james.g.e/api/exploredAreas/:id', {
        id: '@id'
    }, {
        query: {
            method: 'GET',
            isArray: true,
            params: {
                explorerId: '@explorerId'
            },
            url: 'http://saguapi.james.g.e/api/explorers/:explorerId/exploredAreas'
        }
    });

    return exploredAreaResource;
});
