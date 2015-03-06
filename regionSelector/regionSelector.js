(function(){
    var app = angular.module('regionSelector', []);

    app.directive("regionSelector", function() {
        return {
            restrict: 'E',
            templateUrl: "regionSelector/regionSelector.html"
        };
    });

    app.controller('regionSelectController', function(){
        var regionCtrl = this;

        //console.log(game.regionData);
    });
})();