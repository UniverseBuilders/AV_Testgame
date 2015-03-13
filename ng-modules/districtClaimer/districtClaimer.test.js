'use strict'

describe('districtClaimer tests', function() {
    beforeEach(module('districtClaimer'));

    describe('districtClaimController tests', function() {
        var districtClaimController;
        beforeEach(inject(function($injector) {
            districtClaimController = $injector.get('districtClaimController');
        }));

        describe('claimDistrict function', function() {
            it('should add a district to the gameObj', function () {
                var gameObj = {"players":[{
                    "name": "p1",
                    "locations": [
                        {
                            "body": "Earth",
                            "territoryName": "USA - SouthEast",
                            "resources": {"biomass": "1000", "metal": "1000", "energy": "1000"},
                            "districts": [
                                {"name": "p1_home", "type": "solar-power"}
                            ],
                            "units": {"greenhouse": "5", "power plant": "10", "mine": "4"}
                        }
                    ]
                }]};
                gameObj.location = function(){
                    return gameObj.players[0].locations[0]
                };
                gameObj.player = function(){
                    return gameObj.players[0]
                };
                districtClaimController.newDistrictKey = 'solar-power';
                districtClaimController.newDistrictName = 'p1 test new district'

                districtClaimController.claimDistrict(gameObj);

                expect(gameObj.location().districts.length).toEqual(2);
            });
        });
    });
});