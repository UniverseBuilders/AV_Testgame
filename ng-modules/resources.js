(function(){
    var app = angular.module('resources', []);

    app.service('resMath', function() {
        var resMath = {};
        resMath.lessThanOrEq = function (r1, r2){
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

        resMath.add = resMath.sum = function(r1, r2){
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

        resMath.subtract = resMath.difference = function(r1, r2){
            // returns r1 - r2
            var _r2 = {};  // use a copy so we don't mutate original r2
            for (resKey in r2){
                _r2[resKey] = -parseInt(r2[resKey]);
            }
            return resMath.sum(r1, _r2);
        };

        resMath.scale = resMath.multiply = function(resources, scalar){
            // returns resources *= scalar
            var res = {}
            for (resKey in resources){
                res[resKey] = parseInt(resources[resKey]) * scalar
            }
            return res
        };

        return resMath;
    });
}());