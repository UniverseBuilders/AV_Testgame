(function(){
    var app = angular.module('builder', ['gameDataService', 'resources']);

    app.cantAfford = function(){
        // what to do when player can't afford something
        alert('not enough resources to do that!');
    }

    app.service('costOf', [ 'gameData', function(gameData){
        // helps retrieve the costOf things
        costOf = {};
        costOf.upgrade = function(upgradeKey){
            // returns the cost to build given upgrade from table
            return gameData.upgradeData[upgradeKey].cost;
        };
        costOf.district = function(districtKey, location){
            // returns the cost to build new district at given location
            var baseCost = gameData.districtData[districtKey].baseCost;
            //TODO: modify that cost based on location data
            // i.e.
            //   * how many other districts?
            //   * what type of location is this?
            //   * what type of chassis are we putting on the district?
            var cost = baseCost;
            return cost;
        };
        return costOf;
    }]);

    app.service('build', ['resMath', function(resMath) {
        // the build service provides functions to help buy & create in-game units, districts, etc
        var build = {};

        build.district = function(location){
            return true;
        };

        build._it = function(cost, bank, contructFunc, args){
            // executes constructFunc(args) if player bank >= cost and charges cost to bank
            if (resMath.lessThanOrEq(cost, bank) ) {
                newBank = resMath.subtract(bank, cost);
                for (resKey in newBank){
                    if (parseInt(newBank[resKey]) < 1){  // remove resource if 0
                        delete bank[resKey];
                    } else {
                        bank[resKey] = newBank[resKey];
                    }
                }
                contructFunc(args);
            } else {
                app.cantAfford();
            }
        };

        return build;

    }]);
}());