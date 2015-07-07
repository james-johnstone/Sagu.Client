var saguApp = angular.module('saguApp', ['ngResource']);

Array.minObject = function (array, prop) {
    var values = array.filter(function (el) {
        return !!el[prop] || el[prop] === 0;
    }).map(function (el) {
        return el[prop];
    });

    var minIndex = values.indexOf(Math.min.apply(Math, values));
    return array[minIndex]
};

Array.maxObject = function (array, prop) {
    var values = array.filter(function (el) {
        return !!el[prop] || el[prop] === 0;
    }).map(function (el) {
        return el[prop];
    });

    var maxIndex = values.indexOf(Math.max.apply(Math, values));
    return array[maxIndex]
};

Array.maxObject = function (array, prop, prop2) {
    var values = array.filter(function (el) {
        return !!el[prop] || !!el[prop][prop2] || el[prop][prop2] === 0;
    }).map(function (el) {
        return el[prop][prop2];
    });

    var maxIndex = values.indexOf(Math.max.apply(Math, values));
    return array[maxIndex]
};
