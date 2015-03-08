(function(){
    var app = angular.module('regionOverview', []);

    app.directive("regionOverview", function() {
        return {
            restrict: 'E',
            templateUrl: "ng-modules/regionOverview/regionOverview.html"
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
                console.log('err suppressed by regionOverviewController:'+ err.message);
                return false;
            }
        };
    });

    app.controller('districtController', ['gameData', function(gameData){
        var distCtrl = this;
        distCtrl.showUpgrades = false;
        distCtrl.selectedUpgrade = null;
        distCtrl.upgradeObj = {};  // selected upgrade object from /gameData/upgrades.json

        distCtrl.setSelectedUpgrade = function(newUpgKey){
            // sets the selectedUpgrade and loads the appropriate upgradeObj
            distCtrl.selectedUpgrade = newUpgKey;
            distCtrl.upgradeObj = distCtrl.getUpgrade(newUpgKey);
        }

        distCtrl.getPossibleUpgrades = function(type){
            // returns array of upgrades possible given district type
            if (typeof gameData.districtData == 'undefined'){
                console.log('districtData undefined');
            } else {
                return gameData.districtData[type].upgrades;
            }
        };

        distCtrl.getUpgrade = function(key){
            // returns upgrade object for given key
            if (typeof gameData.upgradeData == 'undefined'){
                console.log('upgradeData undefined');
            } else {
                return gameData.upgradeData[key];
            }
        };

        distCtrl.buildUpgrade = function(location, district, uIndex){
            // builds the selectedUpgrade in upgrade slot [uIndex] in the given district
            console.log('adding upgrade ', distCtrl.selectedUpgrade, ' to slot ', uIndex, ' of ', district.name, ' in ', location.territoryName);

            //TODO:
            //location.resources = subtractResources(location.resources, distCtrl.upgradeObj.cost);

            district.upgradeSlots[uIndex] = distCtrl.upgradeObj;
        };
    }]);
})();