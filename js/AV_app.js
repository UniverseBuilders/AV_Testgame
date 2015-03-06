(function() {
    var app = angular.module('avCore', ['districtClaimer']);

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

    var sumResources = function(r1, r2){
        // returns sum of resources in r2 to r1
        // (for max efficiency r2 should be the shorter of the two lists)
        var _res = {};
        // res = copy(r1)
        for (resKey in r1){
            _res[resKey] = r1[resKey];
        }
        // res += r2
        for (resKey in r2){
            if (typeof _res[resKey] === "undefined"){
                _res[resKey] = parseInt(r2[resKey]);
            } else {
                _res[resKey] = parseInt(_res[resKey]) + parseInt(r2[resKey]);
            }
        }
        return _res;
    };

    var scaleResources = function(resources, scalar){
        // returns resources *= scalar
        var res = {}
        for (resKey in resources){
            res[resKey] = parseInt(resources[resKey]) * scalar
        }
        return res
    };

    var getBuildingCost = function(buildingName){
        // returns the cost to build given building type from table

        // TODO: use lookupTable instead of following return

        return {"metal":4, "biomass": 2}
    };

    var resources_lessThanOrEq = function (r1, r2){
        // true if r1 < r2 for all resource values
        for (resKey in r1){
            if (typeof r2[resKey] === "undefined"){
                // r2 has none of this resource
                return false;
            } else {
                if (parseInt(r1[resKey]) <= parseInt(r2[resKey]) ){
                    continue;
                } else {
                    // r2 has less of this resource than r1
                    return false;
                }
            }
        }
        return true;
    };

    var subtractResources = function(r1, r2){
        // returns r1 - r2
        var _r2 = {};  // use a copy so we don't mutate original r2
        for (resKey in r2){
            _r2[resKey] = -parseInt(r2[resKey]);
        }
        return sumResources(r1, _r2);
    };

    app.controller('playerControls', ['$http', function($http) {
        var game = this;
        this.players = [];
        //this.playerID = null; // currently selected player id in players array
        //this.selectedBodyID = null;

        $http.get('/gameData/currentGame.json').success(function(data){
            game.players = data.players;
            game.gameData = data;
        });
        $http.get('/gameData/regions.json').success(function(data){
            game.regionData = data;
        })

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
            if (typeof game.selectedBodyID == "undefined"){
                ;//console.log('WARN: selectedBodyID undefined');
            } else {
                return game.players[game.playerID].locations[game.selectedBodyID];
            }
        };
        this.productionLevels = function(){
            // returns current production levels for given player region
            if (typeof game.location() !== "undefined") {
                var production = {};
                for (buildingName in game.location().units) {
                    var buildingOutput = getProductionLevels(buildingName);
                    var buildingCount = game.location().units[buildingName];
                    var totalOutput = scaleResources(buildingOutput, buildingCount);
                    production = sumResources(production, totalOutput);
                }
                return production;
            } else {
                ; //console.log('WARN: location undefined');
            }
        };
        this.buildIt = function() {
            var amount = $("#build-amount").val();
            var building = $("#selected-building").val();
            try {
                var cost = scaleResources(getBuildingCost(building), amount);
                if (!resources_lessThanOrEq(cost, game.location().resources)) {
                    throw new Error('insufficient resources');
                } else {
                    game.location().resources = subtractResources(game.location().resources, cost);
                }
                // add building to count
                if (typeof game.location().units[building] === undefined){
                    game.location().units[building] = amount;
                } else {
                    game.location().units[building] = parseInt(game.location().units[building]) + parseInt(amount);
                }
                $("#actions-list").append("<li>build " + amount + " " + building + "(s) @ " + game.location().name + " on " + game.location().body);
            } catch (err) {
                if (err.message == "player has no presence in this region"
                    || err.message == "insufficient resources") {
                    alert('not enough resources to build there');
                } else {
                    throw err;
                }
            }
        };

        this.submitTurn = function(){
            var playerName = game.player().name;

            game.player().hasPlayed = true;

            // compute production (@ each location) for this turn
            for (locationIndex in game.player().locations){
                game.selectedBodyID = locationIndex;
                game.location().resources = sumResources(game.location().resources, game.productionLevels());
            }

            game.gameData.players = game.players;

            $.post( "/uploadCurrentGame", game.gameData, function( response ) {
                alert('game json uploaded');
                location.reload();
            });
        };

    }]);

})();