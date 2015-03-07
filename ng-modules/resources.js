(function(){
    var app = angular.module('resources', []);

    app.service('res', function() {
        var res = {};
        res.resources_lessThanOrEq = function (r1, r2){
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
    });
}());