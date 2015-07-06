angular.module('saguApp').factory('areaResource', function($resource) {
  var areaResource = $resource('http://saguapi.james.g.e/api/areas/:id', {id: '@id'});

  return areaResource;
})
