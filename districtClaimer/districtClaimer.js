(function(){
    var app = angular.module('districtClaimer', []);

    app.directive("districtClaimer", function() {
        return {
            restrict: 'E',
            templateUrl: "districtClaimer/districtClaimer.html"
        };
    });

    app.controller('districtClaimController', function(){
        var claimCtrl = this;

        //console.log(game.regionData);
    });
})();