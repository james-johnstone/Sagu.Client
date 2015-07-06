angular.module('saguApp').factory('explorerResource', function($resource) {
  var explorerResource = $resource('http://saguapi.james.g.e/api/explorers/:id', {id: '@id'});

  return explorerResource;
})
