(function(){
    var app = angular.module('districtClaimer', ['gameDataService', 'builder']);

    app.directive("districtClaimer", function() {
        return {
            restrict: 'E',
            templateUrl: "ng-modules/districtClaimer/districtClaimer.html"
        };
    });

    app.controller('districtClaimController', ['gameData', 'costOf', function(gameData, costOf){
        var vm = this;
        this.launchPointID = 0;
        this.newDistrictName = "Springfield";
        this.newDistrictKey = "";
        this.district = {};

        this.getDistrictCost = function(loc){
            // returns the cost to build a new district of type given by newDistrictKey
            console.log('getting cost of ', vm.newDistrictKey, '(len=', vm.newDistrictKey.length, ' in ', loc);
            if (vm.newDistrictKey.length > 0){
                var cost = costOf.district(vm.newDistrictKey, loc);
                console.log('cost=', cost);
                return cost;
            } else {
                return  // key not yet set
            }
        };
        this.claimDistrict= function(gameO){
            // establishes a new district
            var district = gameData.districtData[vm.newDistrictKey];  // district def object
            if ( typeof gameO.location() === "undefined"){
                // player doesn't have anything @ this location yet
                gameO.player().locations.push(
                    {
                        "body": gameO.selectedBodyID,
                        "territoryName": gameO.selectedTerritory,
                        "resources": {
                            "biomass": "0",
                            "metal": "0",
                            "energy": "0"
                        },
                        "districts":[
                            vm.makeNewDistrict(district)
                        ],
                            "units": {
                                "greenhouse": "0",
                                "power plant": "0",
                                "mine": "0"
                        }
                    }
                );
            } else {
                gameO.location().districts.push(vm.makeNewDistrict(district));
            }
            //TODO: subtract cost of establishment from launchPoint
            //gameO.player().locations[vm.launchPointID].resources -= cost

            // change district name to reduce chance of duplicate names
            this.newDistrictName = 'New ' + this.newDistrictName;
        };
        this.makeNewDistrict = function(distr){
            // returns new district object for the game save from given district definition
            return {
                "name": vm.newDistrictName,
                "type": vm.newDistrictKey,
                "upgrades": distr.upgrades,
                "upgradeSlots": vm.getEmptyDistrictUpgradeSlots(distr.upgradeSlots)
            }
        }
        this.getEmptyDistrictUpgradeSlots = function(size){
            // returns array of empty object of appropriate size
            var slots = [];
            for (var i = 0; i < size; i++){
                slots.push({});
            }
            return slots;
        };
    }]);
})();