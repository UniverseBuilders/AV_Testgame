(function(){
    var app = angular.module('gameDataService', []);

    app.service('gameData', ['$http', function($http) {
        if (typeof window.gameData == "undefined") {  // if not yet loaded
            var vm = this;
            vm.ready = false;
            window.gameData = {};

            // game Save
            vm.d_save = new $.Deferred();
            $http.get('gameData/currentGame.json').success(function (data) {
                window.gameData.save = data;
                vm.d_save.resolve();
            });

            // game constants
            vm.d_region = new $.Deferred();
            $http.get('gameData/regions.json').success(function (data) {
                window.gameData.regionData = data;
                vm.d_region.resolve();
            });
            vm.d_districts = new $.Deferred();
            $http.get('gameData/districtTypes.json').success(function (data) {
                window.gameData.districtData = data;
                vm.d_districts.resolve();
            });
            vm.d_upgrades = new $.Deferred();
            $http.get('gameData/upgrades.json').success(function (data) {
                window.gameData.upgradeData = data;
                vm.d_upgrades.resolve();
            });

            $.when(vm.d_save, vm.d_region, vm.d_districts, vm.d_upgrades ).done(function () {
                vm.ready = true;
                console.log(window.gameData);
                $(document).trigger('gameDataLoaded');
            });

            // TODO: wait until ready?
            return window.gameData;
        } else {
            return window.gameData;
        }
    }]);
})();