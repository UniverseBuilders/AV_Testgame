(function() {
    var app = angular.module('avCore', ['resources', 'gameDataService', 'districtClaimer', 'regionSelector', 'regionOverview']);

    var getProductionLevels = function(buildingName){
        // returns the resource production levels for named building from unitProductions lookupTable

        //TODO: use lookupTable instead of the following switch

        switch(buildingName) {
            case "greenhouse":
                return {"biomass":2, "energy":-2};
            case "power plant":
                return {"energy": 1};
            case "mine":
                return {"biomass":-1, "energy":-1, "metal":1}
            default:
                throw new Error("unrecognized building name: " + buildingName);
        }
    };

    app.controller('playerControls', ['gameData', '$http', 'resMath', function(gameData, $http, resMath) {
        game = this;  //TODO: un-global this when not debugging
        this.players = [];
        //this.playerID = null; // currently selected player id in players array
        //this.selectedBodyID = null;

        // NOTE: would love to use gameData service here, but the first call returns faster than the http requests
        //        which means that we would get an empty object. Dunno how to fix this. This also means that you should
        //        not remove the 'gameData' dependency though you can't use it in this scope; leaving it here means that
        //        it will work in other modules.
        $http.get('gameData/currentGame.json').success(function(data){
            game.players = data.players;
            game.gameData = data;
        });
        $http.get('gameData/regions.json').success(function(data){
            game.regionData = data;
        });

        $http.get('gameData/districtTypes.json').success(function(data){
            game.districtData = data;
        });

        this.player = function(){
            // returns player object for currently selected player
            if (typeof game.playerID == "undefined"){
                ;//console.log('WARN: playerID undefined');
            } else {
                return game.gameData.players[game.playerID];
            }
        };
        this.location = function(){
            // returns location object currently selected
            if (typeof game.selectedBodyID == "undefined"
                || typeof game.selectedRegionClass === "undefined"
                || typeof game.selectedTerritory === "undefined"){
                ;//console.log('WARN: selectedBodyID undefined');
            } else {
                for (locationID in game.player().locations){
                    if (game.players[game.playerID].locations[locationID].territoryName === game.selectedTerritory){
                        return game.players[game.playerID].locations[locationID];
                    }
                }
            }
        };
        this.productionLevels = function(){
            // returns current production levels for given player region
            if (typeof game.location() !== "undefined") {
                var production = {};
                for (buildingName in game.location().units) {
                    var buildingOutput = getProductionLevels(buildingName);
                    var buildingCount = game.location().units[buildingName];
                    var totalOutput = resMath.scale(buildingOutput, buildingCount);
                    production = resMath.sum(production, totalOutput);
                }
                return production;
            } else {
                ; //console.log('WARN: location undefined');
            }
        };

        this.submitTurn = function(){
            var playerName = game.player().name;

            game.player().hasPlayed = true;

            // compute production (@ each location) for this turn
            for (locationIndex in game.player().locations){
                game.selectedBodyID = locationIndex;
                game.location().resources = resMath.sum(game.location().resources, game.productionLevels());
            }

            game.gameData.players = game.players;

            $.post( "/uploadCurrentGame", game.gameData, function( response ) {
                alert('game json uploaded');
                location.reload();
            });
        };

    }]);

})();