(function(){
    var app = angular.module('districtClaimer', []);

    app.directive("districtClaimer", function() {
        return {
            restrict: 'E',
            templateUrl: "districtClaimer/districtClaimer.html"
        };
    });

    app.controller('districtClaimController', function(){
        var vm = this;
        this.launchPointID = 0;
        this.newDistrictName = "randomNameHere";
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
                            {
                                "name":vm.newDistrictName,
                                "type":vm.newDistrictType
                            }
                        ],
                            "units": {
                                "greenhouse": "0",
                                "power plant": "0",
                                "mine": "0"
                        }
                    }
                );
            } else {
                gameO.location().districts.push({name:vm.newDistrictName, type:vm.newDistrictType});
            }
            //TODO: subtract cost of establishment from lauchPoint
            //gameO.player().locations[vm.launchPointID].resources -= cost

            //TODO: reset district namer
        }
    });
})();