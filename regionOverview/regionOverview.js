(function(){
    var app = angular.module('regionOverview', []);

    app.directive("regionOverview", function() {
        return {
            restrict: 'E',
            templateUrl: "regionOverview/regionOverview.html"
        };
    });

    app.controller('regionOverviewController', function(){
        var regionOverviewCtrl = this;

        this.hasDistrictIn = function(player, territoryName){
            try{
                // returns true if given player has district in given territory
                for (locationID in player.locations){
                    if (player.locations[locationID].territoryName == territoryName){
                        return true;
                    }
                }
                return false;
            } catch (err){
                console.log('err suppressed by regionOverviewController: ', err);
                return false;
            }
        }
    });
})();