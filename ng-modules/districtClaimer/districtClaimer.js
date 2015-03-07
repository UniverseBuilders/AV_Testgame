(function(){
    var app = angular.module('districtClaimer', []);

    app.directive("districtClaimer", function() {
        return {
            restrict: 'E',
            templateUrl: "ng-modules/districtClaimer/districtClaimer.html"
        };
    });

    app.controller('districtClaimController', function(){
        var vm = this;
        this.launchPointID = 0;
        this.newDistrictName = "Springfield";
        this.newDistrictType = "";

        this.claimDistrict= function(gameO){
            // establishes a new district
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
                            vm.getNewDistrict()
                        ],
                            "units": {
                                "greenhouse": "0",
                                "power plant": "0",
                                "mine": "0"
                        }
                    }
                );
            } else {
                gameO.location().districts.push(vm.getNewDistrict());
            }
            //TODO: subtract cost of establishment from lauchPoint
            //gameO.player().locations[vm.launchPointID].resources -= cost

            // change district name to reduce chance of duplicate names
            this.newDistrictName = 'New ' + this.newDistrictName;
        };
        this.getNewDistrict = function(){
            // returns new district object
            return {
                "name":vm.newDistrictName,
                "type":vm.newDistrictType,
                "upgradeSlots":vm.getEmptyDistrictUpgradeSlots()
            }
        }
        this.getEmptyDistrictUpgradeSlots = function(){
            // returns array of empty object of appropriate size
            var slots = [];
            for (var i = 0; i < vm.getDistrictUpgradeSlotCount(); i++){
                slots.push({});
            }
            return slots;
        };
        this.getDistrictUpgradeSlotCount = function(){
            // returns number of upgrade slots the new district will have (based on district type)
            //TODO:
            return 3;
        };
    });
})();