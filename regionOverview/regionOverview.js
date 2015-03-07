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
        };
    });

    app.controller('districtController', ['$http', function($http){
        var distCtrl = this;
        distCtrl.showUpgrades = false;
        distCtrl.selectedUpgrade = null;

        $http.get('/gameData/districtTypes.json').success(function(data){
            distCtrl.districtData = data;
        });

        distCtrl.getPossibleUpgrades = function(type){
            // returns array of upgrades possible given district type
            if (typeof distCtrl.districtData == 'undefined'){
                console.log('districtData undefined');
            } else {
                return distCtrl.districtData[type].upgrades;
            }
        };

        distCtrl.buildUpgrade = function(district, uIndex){
            // builds the selectedUpgrade in upgrade slot [uIndex] in the given district
            console.log('adding upgrade ', distCtrl.selectedUpgrade, ' to district ', uIndex, ' of ', location.territoryName);
            district.upgradeSlots[uIndex] = {'type':'TESSST upgrade'};
        };
    }]);
})();