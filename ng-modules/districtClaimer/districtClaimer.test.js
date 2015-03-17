'use strict'

describe('districtClaimer tests', function() {

    // load your module
    beforeEach(module('districtClaimer'));



    describe('districtClaimController tests', function() {


        describe('claimDistrict function', function() {
            var $controller;

            beforeEach(inject(function(_$controller_) {
                $controller = _$controller_;
                console.log('c', $controller);
            }));

            console.log('C', $controller);

            it('should add a district to the gameObj', function () {
                var districtClaimController = $controller('districtClaimController');

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

                // TODO: fix gameData loading then come back to this
                //districtClaimController.claimDistrict(gameObj);

                //expect(gameObj.location().districts.length).toEqual(2);
            });
        });
    });
});