(function(){
    var app = angular.module('builder', ['gameDataService']);

    app.cantAfford = function(){
        // what to do when player can't afford something
        alert('not enough resources to do that!');
    }

    app.service('costOf', [ 'gameData', function(gameData){
        // helps retrieve the costOf things
        var costOf = {};
        costOf.upgrade = function(upgradeKey){
            // returns the cost to build given upgrade from table
            return gameData.upgradeData[upgradeKey].cost;
        };
        costOf.district = function(districtKey, location){
            // returns the cost to build new district at given location
            var baseCost = gameData.districtData[districtKey].cost;
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

    app.service('build', function() {
        // the build service provides functions to help buy & create in-game units, districts, etc
        var build = {};

        build._it = function(cost, bank, contructFunc, args){
            // executes constructFunc(args) if player bank >= cost
            if (resMath.lessThanOrEq(cost, bank) ) {
                bank = resMath.subtract(bank, cost);
                contructFunc(args);
            } else {
                app.cantAfford();
            }
        };

        return build;
    });
}());